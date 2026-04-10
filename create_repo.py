import os, json, urllib.request, urllib.error
repo = 'qx-rewrite-hub'
url = 'https://api.github.com/user/repos'
payload = {
    'name': repo,
    'description': 'Quantumult X rewrite collection, starting with DingDing Smart ad blocking.',
    'private': False,
    'auto_init': False,
}
data = json.dumps(payload).encode()
req = urllib.request.Request(
    url,
    data=data,
    method='POST',
    headers={
        'Authorization': 'Bearer ' + os.environ['GITHUB_TOKEN'],
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'minis',
        'Content-Type': 'application/json',
    },
)
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        d = json.load(r)
        print('created', d['html_url'])
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8', 'ignore')
    print('http_error', e.code)
    print(body[:1000])
