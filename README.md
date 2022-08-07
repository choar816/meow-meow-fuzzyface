# meow-meow-fuzzyface

[![Deploy Phaser Application](https://github.com/choar816/meow-meow-fuzzyface/actions/workflows/deploy.yml/badge.svg)](https://github.com/choar816/meow-meow-fuzzyface/actions/workflows/deploy.yml)

meow-meow-fuzzyface는 게임 뱀파이어 서바이벌(Vampire Survivors)에 영감을 받아 만들어진 게임입니다.

- Player
  - 방향키 및 wasd 키로 이동이 가능합니다.
  - 공격은 자동으로 이루어집니다.
  - 기본 공격은 자동으로 가장 가까운 Enemy 방향으로 생성됩니다.
- Enemy
  - 1초마다 화면 바깥에서 자동 생성됩니다.
  - Player를 향해 이동합니다.
  - 공격을 받아 처치된 후, 일정 확률로 ExpUp 아이템을 생성합니다. (확률은 Enemy 종류에 따라 다릅니다.)
- Level up
  - Player가 ExpUp 아이템을 획득하면 경험치가 올라가고, 해당 레벨의 경험치를 모두 채우면 Level up이 됩니다.
  - Level up을 할 때마다 새로운 Enemy가 생성되며, 점점 더 강한 Enemy가 생성됩니다.
- Pause
  - ESC를 눌러 게임을 일시정지 및 해제할 수 있습니다.

- [배포 링크](https://choar816.github.io/meow-meow-fuzzyface/)
- [관련 포스팅](https://choar816.tistory.com/164)
- 강의 제작 중 ([링크](https://github.com/weniv/game-with-phaser))

## Tech Stack
`JavaScript`, `Phaser 3`

- [Phaser 3 project template](https://github.com/photonstorm/phaser3-project-template) 사용

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## development

```sh
$ echo "DEBUG=true" > .env
$ cat .env
DEBUG=true
```

Make `.env` file like above to make game in debug mode.

