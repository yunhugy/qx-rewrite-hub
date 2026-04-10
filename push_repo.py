import os, subprocess, sys
repo_dir = '/var/minis/workspace/qx-rewrite-hub'
remote = 'https://x-access-token:' + os.environ['GITHUB_TOKEN'] + '@github.com/yunhugy/qx-rewrite-hub.git'
cmds = [
    ['git', '-C', repo_dir, 'init'],
    ['git', '-C', repo_dir, 'config', 'user.name', 'yunhugy'],
    ['git', '-C', repo_dir, 'config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com'],
    ['git', '-C', repo_dir, 'add', '.'],
    ['git', '-C', repo_dir, 'commit', '-m', 'init: add DingDing Smart rewrite and repo skeleton'],
    ['git', '-C', repo_dir, 'branch', '-M', 'main'],
    ['git', '-C', repo_dir, 'remote', 'remove', 'origin'],
    ['git', '-C', repo_dir, 'remote', 'add', 'origin', remote],
    ['git', '-C', repo_dir, 'push', '-u', 'origin', 'main'],
]
for cmd in cmds:
    try:
        r = subprocess.run(cmd, check=False, capture_output=True, text=True)
        print('$', ' '.join(cmd[:-1] + ['***']) if 'x-access-token:' in ' '.join(cmd) else '$ ' + ' '.join(cmd))
        if r.stdout:
            print(r.stdout.strip())
        if r.returncode != 0 and r.stderr:
            print(r.stderr.strip())
        if r.returncode != 0 and cmd[-2:] != ['remove', 'origin']:
            sys.exit(r.returncode)
    except Exception as e:
        print('ERR', e)
        sys.exit(1)
