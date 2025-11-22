# 💎 Corrida das Gemas

![Status](https://img.shields.io/badge/Status-Descontinuado-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> ⚠️ **PROJETO ARQUIVADO:** Este projeto foi iniciado como um estudo de mecânicas de jogos e multiplayer, mas seu desenvolvimento foi interrompido. O código está disponível para consulta e referência, mas não receberá novas atualizações.

### 🎮 Sobre o Projeto

**Corrida das Gemas** é um jogo de *Tower Defense* competitivo inspirado em **Rush Royale**.

O objetivo era criar um jogo de estratégia em tempo real onde jogadores montam baralhos de heróis, invocam unidades no tabuleiro e realizam fusões (*merge*) para aumentar o poder de defesa contra ondas de inimigos.

### ✨ Funcionalidades Implementadas

Apesar de não finalizado, o projeto conta com sistemas complexos funcionais:

* **⚔️ Modos de Jogo:**
    * **PvP Online (P2P):** Implementação de WebRTC para batalhas em tempo real entre jogadores.
    * **PvE / Campanha:** Lógica de ondas de inimigos e chefes.
    * **Modo Treino:** Recursos infinitos para testar combinações.
* **🃏 Sistema de Deck:**
    * Gerenciamento de múltiplos baralhos.
    * Seleção de heróis com diferentes raridades (Comum, Raro, Épico, Lendário).
* **🎲 Mecânicas de Jogo:**
    * **Sistema de Merge:** Fusão de unidades para subir de nível.
    * **Habilidades Especiais:** Lógica para unidades únicas como *Cultista* (bônus por adjacência), *Fada do Bosque* (merge universal) e *Bobo da Corte* (cópia).

---

### 🛠️ Tecnologias Utilizadas

* **[React 19](https://react.dev/)**
* **[TypeScript](https://www.typescriptlang.org/)**
* **[Vite](https://vitejs.dev/)**
* **[Tailwind CSS](https://tailwindcss.com/)**
* **[WebRTC](https://webrtc.org/)** (Para comunicação Peer-to-Peer no PvP)

---

### 🚀 Como rodar (Para curiosos)

Se você quiser testar o que foi construído até agora:

#### 1. Clone o repositório
```bash
git clone [https://github.com/devsilvver/corrida-das-gemas.git](https://github.com/devsilvver/corrida-das-gemas.git)
cd corrida-das-gemas
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure o Ambiente
Crie um arquivo `.env` na raiz (necessário apenas se for usar recursos que pedem API Key, como IA, caso contrário o jogo roda localmente):
```env
GEMINI_API_KEY="sua-chave-opcional"
```

#### 4. Rode o projeto
```bash
npm run dev
```

---

### 📂 Estrutura do Projeto

```text
src/
├── components/        # Componentes do jogo (Tabuleiro, Cartas, UI)
├── p2p.ts            # Lógica de conexão WebRTC para o Multiplayer
├── types.ts          # Definições de tipos (Unidades, Inimigos)
├── constants.tsx     # Configuração dos Personagens e Balanceamento
└── App.tsx           # Gerenciamento de estados globais do jogo
```

---

### 👤 Autor

Feito por **Guilherme Silvestrini**.

<a href="https://www.linkedin.com/in/guilherme-silvestrini-782226233/" target="_blank">
 <img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank">
</a>
<a href="mailto:contatosilvestrini@gmail.com">
 <img src="https://img.shields.io/badge/-Gmail-%23D14836?style=for-the-badge&logo=gmail&logoColor=white" target="_blank">
</a>
