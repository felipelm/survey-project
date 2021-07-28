Git Alias

`git config --global --edit`

```
# This is Git's per-user configuration file.
[user]
# Please adapt and uncomment the following lines:
 name = Felipe Machado
 email = felipelm123@gmail.com
# email = felipemachado@Felipes-MacBook-Pro.local
[filter "lfs"]
 required = true
 clean = git-lfs clean -- %f
 smudge = git-lfs smudge -- %f
 process = git-lfs filter-process
[push]
  followTags = true
[alias]
  l = !git log --pretty=format:'%C(blue)%h %C(red)%d %C(white)%s - %C(cyan)%cn, %C(green)%cr'
  s = !git status -s
  cnt = !git add --all -- ':!*.spec.ts' && git commit -m
  c = !git add --all && git commit -m
```
