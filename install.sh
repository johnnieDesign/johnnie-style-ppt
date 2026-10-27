#!/bin/bash
# johnnie-style-ppt 설치: 이 폴더를 Claude Code · Codex 스킬 위치에 연결하고, 필요한 것을 확인한다.
# 여러 번 돌려도 안전하다. 이미 다른 폴더가 있으면 건드리지 않는다.
#
#   bash install.sh
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
NAME="johnnie-style-ppt"

link() {
  local dir="$1" dst="$1/$NAME"
  if [[ -e "$dst" && "$(cd "$dst" && pwd -P)" == "$SRC" ]]; then
    echo "  OK      $dst"
    return
  fi
  if [[ -e "$dst" || -L "$dst" ]]; then
    echo "  !! 이미 다른 것이 있어 건드리지 않음: $dst"
    return
  fi
  mkdir -p "$dir"
  ln -s "$SRC" "$dst"
  echo "  연결됨  $dst"
}

echo "스킬 연결"
link "$HOME/.claude/skills"
if [[ -d "$HOME/.codex" ]]; then link "$HOME/.codex/skills"; else echo "  건너뜀  Codex 없음"; fi

echo
echo "필요한 것"
for c in python3 node git; do
  if command -v "$c" >/dev/null 2>&1; then echo "  OK      $c"; else echo "  !! 없음 $c"; fi
done
if command -v node >/dev/null 2>&1 && ! node -e 'process.exit(+process.versions.node.split(".")[0] >= 22 ? 0 : 1)'; then
  echo "  !! Node 22 이상이 필요하다(지금 $(node --version))"
fi
if [[ -d "/Applications/Google Chrome.app" || -n "${CHROME:-}" ]]; then echo "  OK      Google Chrome"; else echo "  !! 없음 Google Chrome"; fi
if ls "$HOME/Library/Fonts" /Library/Fonts 2>/dev/null | grep -qi '^pretendard'; then
  echo "  OK      Pretendard(기본 장표 서체)"
else
  echo "  !! 없음 Pretendard: https://github.com/orioncactus/pretendard/releases 에서 받아 설치(다른 서체를 쓸 거면 무시)"
fi
if security find-generic-password -a "$USER" -s typecast-api-key >/dev/null 2>&1; then
  echo "  OK      Typecast 키(음성)"
else
  echo "  --      Typecast 키 없음: 음성 없이도 쓸 수 있다. 넣는 법은 references/script.md"
fi
echo
echo "끝. Claude Code 에서 \"발표 장표 만들어줘\" 라고 하면 시작한다."
