# Corrida das Gemas

Protótipo de tower defense competitivo com React, TypeScript e WebRTC, inspirado em Rush Royale.

**Status: desenvolvimento descontinuado.** O código fica disponível como estudo; o projeto está incompleto e os modos não têm garantia de estabilidade.

## Sistemas presentes no código

- Baralhos, raridades e seleção de unidades.
- Tabuleiro, invocação e fusão de unidades.
- Ondas de inimigos, chefes e modos de jogo.
- Multiplayer P2P com WebRTC e troca manual de oferta/resposta.
- Persistência de baralhos no `localStorage` do navegador.

## Executar localmente

Pré-requisitos: Node.js e npm.

```bash
git clone https://github.com/devsilvver/corrida-das-gemas.git
cd corrida-das-gemas
npm install
npm run dev
```

A configuração usa a porta 3000; confira a URL exibida pelo Vite. O código atual não exige chave Gemini para iniciar.

```bash
npm run build
npm run preview
```

O build é gerado em `dist/`.

## Limitações

O multiplayer depende da rede dos participantes e usa um servidor STUN público. Não há servidor TURN configurado. A implementação é experimental, sem garantia de conexão ou sincronização em todas as redes.

Os estilos usam Tailwind via CDN e fontes externas. Os dados locais dos baralhos pertencem ao navegador utilizado.

## Estrutura

```text
components/     # Tabuleiro, cartas, telas e interface
App.tsx         # Estado e fluxo principal
constants.tsx   # Personagens e balanceamento
p2p.ts          # Comunicação WebRTC
index.tsx       # Entrada React
types.ts        # Tipos do jogo
vite.config.ts  # Configuração do Vite
```

## Autor e licença

[Guilherme Silvestrini](https://github.com/devsilvver) · [LinkedIn](https://www.linkedin.com/in/guilherme-silvestrini-782226233/) · [E-mail](mailto:contatosilvestrini@gmail.com)

Código sob [licença MIT](LICENSE).
