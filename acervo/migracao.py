#!/usr/bin/env python3
"""Read-only inventory / remote reconciliation and explicit local restore.

No Drive authentication, Git mutation, source deletion or payment operations.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import tempfile
import unicodedata

SCHEMA = 1
WALLPAPERS = 'wallpapers-e-comandos-linux'
KEEP = {(WALLPAPERS, 'linux/terminal/fastfetch/gojo.png')}


def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def relative(value):
    if not isinstance(value, str) or not value or '\\' in value or '\0' in value:
        raise ValueError(f'Invalid relative path: {value!r}')
    parts = value.split('/')
    if value.startswith('/') or any(p in ('', '.', '..') for p in parts):
        raise ValueError(f'Unsafe relative path: {value!r}')
    return PurePosixPath(value)


def safe_join(root, value):
    root = Path(root).absolute()
    parts = relative(value).parts
    # Resolve each existing parent; reject symlinks even if they point inward.
    current = root
    if root.is_symlink():
        raise ValueError('Root must not be a symlink')
    for part in parts:
        current /= part
        if current.is_symlink():
            raise ValueError(f'Symlink rejected: {current}')
    if not current.resolve(strict=False).is_relative_to(root.resolve()):
        raise ValueError('Path escaped its root')
    return current


def portable_warnings(value):
    result = []
    for p in relative(value).parts:
        if re.search(r'[<>:"|?*\x00-\x1f]', p) or p.endswith((' ', '.')):
            result.append('nome incompatível com Windows')
        if p.split('.')[0].upper() in {'CON', 'PRN', 'AUX', 'NUL', *[f'COM{i}' for i in range(1, 10)], *[f'LPT{i}' for i in range(1, 10)]}:
            result.append('nome reservado no Windows')
    return sorted(set(result))


def portable_key(value):
    return '/'.join(unicodedata.normalize('NFC', p).casefold().rstrip(' .') for p in relative(value).parts)


def hashes(path):
    before = path.stat()
    md5 = hashlib.md5(usedforsecurity=False)
    sha256 = hashlib.sha256()
    blob = hashlib.sha1(usedforsecurity=False)
    blob.update(f'blob {before.st_size}\0'.encode())
    size = 0
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            size += len(block)
            md5.update(block)
            sha256.update(block)
            blob.update(block)
    after = path.stat()
    if size != before.st_size or (before.st_size, before.st_mtime_ns, before.st_ino) != (after.st_size, after.st_mtime_ns, after.st_ino):
        raise ValueError(f'Source changed while hashing: {path}')
    return {'bytes': size, 'md5': md5.hexdigest(), 'sha256': sha256.hexdigest(), 'git_blob_sha': blob.hexdigest()}


def atomic_json(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=path.name + '.', dir=path.parent)
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as out:
            json.dump(data, out, ensure_ascii=False, indent=2)
            out.write('\n')
            out.flush()
            os.fsync(out.fileno())
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def blockers(row):
    repo, path = row['repo'], row['path']
    reasons = []
    if (repo, path) in KEEP:
        reasons.append('preservar recurso usado pelo Fastfetch')
    if repo == 'Site-para-estudos':
        reasons.append('validar finalidade ou adaptar players antes de retirar')
    if repo in ('semDP', 'em-busca-do-linux-autom-tico'):
        reasons.append('trocar referências na documentação e verificar acesso')
    if path.lower().endswith(('.zip', '.rar', '.7z', '.tar', '.gz')):
        reasons.append('inspecionar e extrair arquivos: usuário recusou imagens compactadas')
    if row['action'] != 'drive':
        reasons.append('arquivo reconstruível: verificar reinstalação/build, sem envio ao Drive')
    return reasons


def load_manifest(path):
    d = read_json(path)
    if d.get('schema') != SCHEMA:
        raise ValueError('Unsupported manifest schema')
    seen = set()
    for r in d['files']:
        relative(r['repo'])
        if '/' in r['repo']:
            raise ValueError('Invalid repo')
        relative(r['path'])
        key = (r['repo'], r['path'])
        if key in seen:
            raise ValueError('Duplicate source path')
        seen.add(key)
        if not re.fullmatch('[0-9a-f]{40}', r['expected_git_sha']):
            raise ValueError('Invalid Git SHA')
    return d


def inventory(args):
    candidates = read_json(args.candidates)
    # Keep Fastfetch's gojo.png in the complete Drive collection, without removal.
    if args.wallpapers:
        existing = {(r['repo'], r['path']) for r in candidates}
        for old in read_json(args.wallpapers):
            key = (WALLPAPERS, old['relative'])
            if key not in existing:
                p = safe_join(Path(args.root) / WALLPAPERS, old['relative'])
                h = hashes(p)
                candidates.append({'repo': WALLPAPERS, 'path': old['relative'], 'bytes': old['bytes'], 'sha': h['git_blob_sha'], 'action': 'drive'})
                existing.add(key)
    seen, files = set(), []
    portable = {}
    for row in sorted(candidates, key=lambda r: (r['repo'], r['path'])):
        repo, path = row['repo'], row['path']
        relative(repo)
        if '/' in repo:
            raise ValueError('Repo is not a directory name')
        relative(path)
        if (repo, path) in seen:
            raise ValueError(f'Duplicate candidate: {repo}/{path}')
        seen.add((repo, path))
        if not re.fullmatch('[0-9a-f]{40}', row['sha']):
            raise ValueError('Invalid Git SHA')
        key = portable_key(f'{repo}/{path}')
        portable.setdefault(key, []).append(f'{repo}/{path}')
        source = safe_join(Path(args.root) / repo, path)
        if not source.is_file() and args.extra_root:
            source = safe_join(Path(args.extra_root) / repo, path)
        rec = {'repo': repo, 'path': path, 'action': row['action'], 'expected_bytes': row['bytes'], 'expected_git_sha': row['sha'], 'source_status': 'missing', 'removal_blockers': blockers(row), 'portable_warnings': portable_warnings(path), 'remote_status': 'not_checked'}
        rec['drive_relative_path'] = ('Imagens/Wallpapers/' if repo == WALLPAPERS else f'Projetos/{repo}/') + path
        if source.is_file():
            rec.update(hashes(source))
            rec['source_file'] = str(source.absolute())
            rec['source_status'] = 'verified' if rec['git_blob_sha'] == row['sha'] and rec['bytes'] == row['bytes'] else 'changed_from_audit'
        files.append(rec)
    # Earlier upload logs are hints; they never count as remote verification.
    by_path = {(r['repo'], r['path']): r for r in files}
    if args.receipts:
        for line in Path(args.receipts).read_text(encoding='utf-8').splitlines():
            old = json.loads(line)
            rec = by_path.get((WALLPAPERS, old['relative']))
            if rec and old.get('id'):
                rec.setdefault('prior_drive_ids', [])
                if old['id'] not in rec['prior_drive_ids']:
                    rec['prior_drive_ids'].append(old['id'])
    collisions = [v for v in portable.values() if len(v) > 1]
    result = {'schema': SCHEMA, 'generated_at': dt.datetime.now(dt.timezone.utc).isoformat(), 'source_root': str(Path(args.root).absolute()), 'portable_collisions': collisions, 'files': files, 'policy': 'individual files; never remove before remote hash and dependency verification; no source/Git mutation'}
    atomic_json(args.output, result)
    print(json.dumps({'files': len(files), 'drive_files': sum(r['action'] == 'drive' for r in files), 'local_verified': sum(r['source_status'] == 'verified' for r in files), 'missing': sum(r['source_status'] == 'missing' for r in files), 'changed': sum(r['source_status'] == 'changed_from_audit' for r in files), 'portable_collisions': len(collisions)}, ensure_ascii=False))


def verify_remote(args):
    manifest = load_manifest(args.manifest)
    rows = read_json(args.metadata)
    # Explicit mapping provided by the uploader: repo,path,id,expected_parent_id,
    # metadata={id,name,size,md5Checksum,parents,trashed}. Metadata is a NEW read.
    mapped = {}
    for r in rows:
        key = (r['repo'], r['path'])
        if key in mapped:
            raise ValueError(f'Duplicate remote mapping: {key}')
        mapped[key] = r
    count = 0
    for record in manifest['files']:
        record['remote_status'] = 'not_checked'
        for stale in ('remote_full_download_sha256', 'remote_verification_method', 'remote_checked_at', 'drive_id', 'drive_parent_id', 'drive_url', 'remote_errors'):
            record.pop(stale, None)
        remote = mapped.get((record['repo'], record['path']))
        if not remote:
            continue
        meta = remote['metadata']
        reasons = []
        if record['source_status'] != 'verified': reasons.append('local source not verified')
        if not re.fullmatch('[A-Za-z0-9_-]+', remote.get('id', '')): reasons.append('invalid file ID')
        if meta.get('id') != remote.get('id'): reasons.append('ID mismatch')
        if meta.get('name', meta.get('title')) != PurePosixPath(record['path']).name: reasons.append('filename mismatch')
        if str(meta.get('size')) != str(record.get('bytes')): reasons.append('size mismatch')
        if not remote.get('expected_parent_id') or remote['expected_parent_id'] not in meta.get('parents', meta.get('parent_ids', [])): reasons.append('folder mismatch')
        checksum_verified = bool(record.get('md5')) and meta.get('md5Checksum') == record.get('md5')
        if args.download_root and remote.get('download_relative_path'):
            downloaded = safe_join(args.download_root, remote['download_relative_path'])
            if downloaded.is_file():
                h = hashes(downloaded)
                checksum_verified = h['sha256'] == record.get('sha256') and h['md5'] == record.get('md5') and h['bytes'] == record.get('bytes')
                if checksum_verified:
                    record['remote_full_download_sha256'] = h['sha256']
                    record['remote_verification_method'] = 'complete_download'
            else:
                checksum_verified = False
        if not checksum_verified: reasons.append('remote MD5 absent/mismatch and no matching complete download')
        if meta.get('trashed') is True or meta.get('is_trashed') is True: reasons.append('file in trash')
        if any(p.get('type') in ('anyone', 'domain') for p in meta.get('permissions', [])):
            reasons.append('unexpected public/domain sharing')
        if 'trashed' not in meta and 'is_trashed' not in meta and not record.get('remote_full_download_sha256'):
            reasons.append('trash status not confirmed without complete accessible download')
        record['remote_status'] = 'verified' if not reasons else 'rejected'
        record['remote_errors'] = reasons
        if not reasons:
            record['drive_id'] = remote['id']
            record['drive_parent_id'] = remote['expected_parent_id']
            record['drive_url'] = f"https://drive.google.com/file/d/{remote['id']}/view"
            record['remote_checked_at'] = remote.get('checked_at')
            count += 1
    atomic_json(args.output, manifest)
    print(json.dumps({'remote_verified': count, 'eligible_for_dependency_review': sum(r['remote_status'] == 'verified' and not r['removal_blockers'] for r in manifest['files'])}))


def restore(args):
    manifest = load_manifest(args.manifest)
    if manifest['portable_collisions']:
        raise ValueError('Resolve portable filename collisions before restoring')
    tasks, identical = [], 0
    destination_root = Path(args.destination).absolute()
    if destination_root.is_symlink(): raise ValueError('Destination cannot be a symlink')
    for r in manifest['files']:
        if r['repo'] != args.repo or r['action'] != 'drive': continue
        if r.get('source_status') != 'verified' or r.get('remote_status') != 'verified':
            raise ValueError(f"Source/remote unverified: {r['path']}")
        if r.get('portable_warnings'): raise ValueError(f"Nonportable filename: {r['path']}")
        sha = r.get('sha256', '')
        if not re.fullmatch('[0-9a-f]{64}', sha): raise ValueError('SHA-256 missing')
        cached = safe_join(args.cache, sha)
        if not cached.is_file() or hashes(cached)['sha256'] != sha:
            raise ValueError(f"Download/cache absent or hash mismatch: {r['path']}")
        target = safe_join(destination_root, r['path'])
        if target.exists():
            if target.is_file() and hashes(target)['sha256'] == sha:
                identical += 1
                continue
            raise ValueError(f'Existing file conflicts: {target}')
        tasks.append((cached, target))
    if not tasks and not identical: raise ValueError('No files matched repository')
    # All records and existing targets checked before creating any file.
    if args.apply:
        for cached, target in tasks:
            target.parent.mkdir(parents=True, exist_ok=True)
            safe_join(destination_root, str(target.relative_to(destination_root)))
            fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_NOFOLLOW', 0), 0o600)
            try:
                with os.fdopen(fd, 'wb') as out, cached.open('rb') as inp:
                    shutil.copyfileobj(inp, out, 1024 * 1024)
                    out.flush()
                    os.fsync(out.fileno())
                if hashes(target)['sha256'] != cached.name:
                    target.unlink()
                    raise ValueError(f'Restored hash mismatch: {target}')
            except Exception:
                if target.is_file(): target.unlink()
                raise
    print(json.dumps({'mode': 'apply' if args.apply else 'dry_run', 'restore_files': len(tasks), 'already_identical': identical}))


def cache_import(args):
    """Verify individual files downloaded with an authorized Drive client."""
    manifest = load_manifest(args.manifest)
    tasks, identical = [], 0
    for r in manifest['files']:
        if r['repo'] != args.repo or r['action'] != 'drive': continue
        if r.get('source_status') != 'verified' or r.get('remote_status') != 'verified':
            raise ValueError(f"Source/remote unverified: {r['path']}")
        sha = r.get('sha256', '')
        if not re.fullmatch('[0-9a-f]{64}', sha): raise ValueError('SHA-256 missing')
        source = safe_join(args.source, r['path'])
        if not source.is_file() or hashes(source)['sha256'] != sha:
            raise ValueError(f"Download absent or hash mismatch: {r['path']}")
        target = safe_join(args.cache, sha)
        if target.exists():
            if target.is_file() and hashes(target)['sha256'] == sha:
                identical += 1
                continue
            raise ValueError(f'Cache conflict: {target}')
        if all(t[1] != target for t in tasks): tasks.append((source, target))
    if not tasks and not identical: raise ValueError('No files matched repository')
    if args.apply:
        Path(args.cache).mkdir(parents=True, exist_ok=True)
        for source, target in tasks:
            fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_NOFOLLOW', 0), 0o600)
            try:
                with os.fdopen(fd, 'wb') as out, source.open('rb') as inp:
                    shutil.copyfileobj(inp, out, 1024 * 1024)
                    out.flush()
                    os.fsync(out.fileno())
                if hashes(target)['sha256'] != target.name:
                    raise ValueError(f'Copy changed while importing: {source}')
            except Exception:
                if target.is_file(): target.unlink()
                raise
    print(json.dumps({'mode': 'apply' if args.apply else 'dry_run', 'cache_files': len(tasks), 'already_identical': identical}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    inv = sub.add_parser('inventory'); inv.add_argument('--candidates', required=True); inv.add_argument('--root', required=True); inv.add_argument('--extra-root'); inv.add_argument('--wallpapers'); inv.add_argument('--receipts'); inv.add_argument('--output', required=True); inv.set_defaults(run=inventory)
    ver = sub.add_parser('verify-remote'); ver.add_argument('--manifest', required=True); ver.add_argument('--metadata', required=True); ver.add_argument('--download-root'); ver.add_argument('--output', required=True); ver.set_defaults(run=verify_remote)
    res = sub.add_parser('restore'); res.add_argument('--manifest', required=True); res.add_argument('--cache', required=True); res.add_argument('--repo', required=True); res.add_argument('--destination', required=True); res.add_argument('--apply', action='store_true'); res.set_defaults(run=restore)
    imp = sub.add_parser('cache-import'); imp.add_argument('--manifest', required=True); imp.add_argument('--source', required=True); imp.add_argument('--cache', required=True); imp.add_argument('--repo', required=True); imp.add_argument('--apply', action='store_true'); imp.set_defaults(run=cache_import)
    args = parser.parse_args()
    args.run(args)


if __name__ == '__main__':
    main()
