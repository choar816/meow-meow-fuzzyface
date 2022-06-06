# meow-meow-fuzzyface

[![Deploy Phaser Application](https://github.com/choar816/meow-meow-fuzzyface/actions/workflows/deploy.yml/badge.svg)](https://github.com/choar816/meow-meow-fuzzyface/actions/workflows/deploy.yml)

meow-meow-fuzzyface는 게임 뱀파이어 서바이벌(Vampire Survivors)을 클론코딩한 게임입니다.

방향키 및 wasd 키로 Player 이동이 가능하며, 공격은 자동으로 이루어집니다.
- [배포 링크](https://choar816.github.io/meow-meow-fuzzyface/)
- [관련 포스팅](https://choar816.tistory.com/164)

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

