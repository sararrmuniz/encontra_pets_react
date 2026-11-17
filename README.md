# 🐾 Encontra Pets

Uma aplicação web em desenvolvimento para aproximar animais de estimação de quem pode ajudar: encontrar um lar, reencontrar sua família ou receber cuidados.

O projeto está sendo construído com foco em uma experiência acolhedora, responsiva e simples de usar. Esta versão já apresenta a identidade visual, a navegação principal e um carrossel de banners para adoção, pets perdidos e animais encontrados.

## ✨ O que já está implementado

- **Cabeçalho responsivo** com navegação para telas grandes e menu móvel.
- **Carrossel de banners** com três temas, ícones, botões e indicadores.
- **Controles do carrossel** para avançar, voltar ou selecionar um slide; a rotação automática pausa quando o cursor está sobre o banner.
- **Layout adaptável** para diferentes larguras de tela.
- **Componentes reutilizáveis** para estruturar seções e conteúdo.
- **Autenticação e persistência** com Supabase para usuários e anúncios de pets.
- **Perfil do usuário** para editar dados pessoais e gerenciar os próprios anúncios.

> **Estado do projeto:** os botões dos banners são atualmente visuais. A edição de perfil e anúncios utiliza as políticas de acesso configuradas no Supabase.

## 🧰 Tecnologias

- [React 19](https://react.dev/) e [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) para desenvolvimento e build
- [Tailwind CSS 4](https://tailwindcss.com/) e CSS Modules
- [Lucide React](https://lucide.dev/) para ícones
- [Supabase](https://supabase.com/) para autenticação e banco de dados
- [React Router](https://reactrouter.com/) para navegação entre páginas
- ESLint para análise estática

## 🚀 Começando

### Pré-requisitos

- Node.js
- npm

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/sararrmuniz/encontra_pets_react.git
cd encontra_pets_react/encontra-pets
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite mostrará no terminal o endereço local para abrir no navegador.

### Banco de dados

Para habilitar a marcação de anúncios como resolvidos, execute o SQL de
[`supabase/migrations/20261117110000_add_pet_resolution.sql`](./supabase/migrations/20261117110000_add_pet_resolution.sql)
no SQL Editor do projeto Supabase. O projeto também precisa das políticas RLS
que permitem a cada usuário ler e editar apenas o próprio perfil e os próprios
anúncios; a leitura pública dos anúncios ativos deve continuar habilitada.
Ao publicar a aplicação, configure o host para direcionar rotas desconhecidas
para `index.html`, permitindo abrir diretamente a rota `/perfil`.

## 📜 Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com atualização em tempo real. |
| `npm run build` | Verifica os tipos TypeScript e gera a versão de produção em `dist/`. |
| `npm run preview` | Serve localmente a versão de produção gerada. |
| `npm run lint` | Executa o ESLint no projeto. |

## 📁 Estrutura do projeto

```text
src/
├── assets/                  # Imagens e recursos estáticos
├── components/
│   ├── BannerCarousel/      # Banners, controles e estilos do carrossel
│   ├── Container/           # Wrapper reutilizável para conteúdo
│   ├── Header/              # Cabeçalho e navegação responsiva
│   └── Section/             # Estrutura e espaçamento das seções
├── styles/
│   ├── globals.css          # Tailwind, tema e estilos globais
│   └── App.css
├── pages/
│   └── ProfilePage.tsx      # Edição do perfil e gerenciamento dos anúncios
├── App.tsx                  # Rotas e composição principal da aplicação
└── main.tsx                 # Inicialização do React
```

As alterações do banco de dados ficam em `supabase/migrations/`.

O alias `@/` aponta para `src/`; por exemplo, `@/components/Header` importa um componente de `src/components/Header`.

## 🎨 Personalização

- Os textos, imagens, temas e ações dos banners estão definidos em `src/components/BannerCarousel/index.tsx`.
- O visual do carrossel fica em `src/components/BannerCarousel/styles.module.css`.
- As cores de marca e as fontes do tema global estão configuradas em `src/styles/globals.css`.
- A estrutura da página inicial é montada em `src/App.tsx`.

As imagens dos banners são carregadas do Unsplash e as fontes são servidas pelo Google Fonts; ambos precisam de conexão à internet para carregar externamente.

## 🛣️ Próximos passos possíveis

- Implementar as ações de busca e os filtros dos banners.
- Permitir upload de imagens para os anúncios.
- Completar os destinos de navegação das seções da página.

---

Feito com cuidado por animais e por quem acredita que todo pet merece ser encontrado. 💛
