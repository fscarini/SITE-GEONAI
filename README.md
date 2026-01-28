# Site Geon AI - Documentação Completa

## Visão Geral

Este projeto consiste em um site profissional e imersivo para a empresa Geon AI, especializada em automação com inteligência artificial. O site foi desenvolvido com foco em design moderno, interatividade e experiência do usuário excepcional.

## Características Principais

### Design e Identidade Visual
- **Paleta de Cores**: Azul marinho escuro (#0A1128), azul vibrante (#007bff), branco e preto
- **Tipografia**: Montserrat para títulos, Open Sans para texto corpo
- **Estilo**: Moderno, tecnológico, profissional e imersivo
- **Tema**: Baseado no logo espiral da empresa com animações relacionadas

### Funcionalidades Implementadas
- ✅ Design responsivo para desktop, tablet e mobile
- ✅ Navegação suave entre seções
- ✅ Animações CSS e JavaScript
- ✅ Carrossel de depoimentos interativo
- ✅ Formulário de contato com validação
- ✅ Efeitos de hover e micro-interações
- ✅ Indicador de progresso de scroll
- ✅ Botões flutuantes (WhatsApp e voltar ao topo)
- ✅ Background de partículas animadas
- ✅ Loading screen com animação espiral

## Estrutura do Projeto

```
geon-ai-website/
├── index.html          # Arquivo HTML principal
├── styles.css          # Estilos CSS completos
├── script.js           # JavaScript para interatividade
├── README.md           # Esta documentação
├── GEONAI-LOGO01.png   # Logo com fundo azul
├── GEONAI-LOGO02.png   # Logo com fundo branco
└── GEONAI-LOGO07.png   # Logo espiral isolado
```

## Seções do Site

### 1. Hero Section
- Logo animado da Geon AI
- Título principal com efeito de destaque
- Subtítulo explicativo
- Dois botões de call-to-action
- Indicador de scroll animado

### 2. Sobre Nós
- História da empresa
- Missão e visão
- Valores organizacionais (4 valores com ícones)
- Apresentação dos 3 sócios fundadores
- Cards interativos com informações da equipe

### 3. Serviços
- 6 serviços principais:
  - Automação de Processos (RPA + IA)
  - Análise Inteligente de Dados
  - Chatbots e Assistentes Virtuais
  - Automação de Marketing e Vendas
  - Visão Computacional
  - Consultoria e Estratégia em IA
- Metodologia de trabalho em 3 etapas
- Cards com hover effects e animações

### 4. Projetos
- 4 casos de sucesso com métricas reais
- Resultados quantificados
- Tecnologias utilizadas
- Design de cards atrativo

### 5. Depoimentos
- Carrossel interativo com 3 depoimentos
- Navegação por botões e dots
- Auto-play funcional
- Avaliações com estrelas

### 6. Contato
- Formulário completo com validação
- Informações de contato
- Horário de atendimento
- Layout em duas colunas

### 7. Footer
- Links rápidos
- Informações de contato
- Redes sociais
- Links legais

## Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, animações, gradientes
- **JavaScript ES6+**: Interatividade e funcionalidades dinâmicas

### Bibliotecas Externas
- **Google Fonts**: Montserrat e Open Sans
- **Font Awesome 6.4.0**: Ícones
- **AOS (Animate On Scroll)**: Animações de scroll
- **Particles.js**: Background de partículas animadas

### Recursos Implementados
- CSS Custom Properties (variáveis)
- Flexbox e CSS Grid
- Media queries para responsividade
- Animações CSS keyframes
- JavaScript modular
- Event listeners otimizados
- Debounce e throttle para performance

## Paleta de Cores

```css
--primary-color: #0A1128;      /* Azul marinho escuro */
--secondary-color: #007bff;    /* Azul vibrante */
--accent-color: #00d4ff;       /* Azul claro */
--text-light: #ffffff;         /* Branco */
--text-dark: #000000;          /* Preto */
--text-gray: #cccccc;          /* Cinza claro */
```

## Responsividade

O site é totalmente responsivo com breakpoints:
- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

### Adaptações Mobile
- Menu hamburger
- Layout de uma coluna
- Botões adaptados
- Formulário otimizado
- Carrossel touch-friendly

## Acessibilidade

- Contraste adequado (WCAG)
- Navegação por teclado
- Texto alternativo para imagens
- Estrutura semântica HTML
- Focus management
- Reduced motion support

## Performance

### Otimizações Implementadas
- Throttle em eventos de scroll
- Debounce em inputs
- Lazy loading de animações
- Minificação de recursos
- Compressão de imagens
- Preload de fontes críticas

## Como Executar

### Método 1: Servidor HTTP Python
```bash
cd geon-ai-website
python3 -m http.server 8000
# Acesse: http://localhost:8000
```

### Método 2: Live Server (VS Code)
1. Instale a extensão Live Server
2. Clique com botão direito em index.html
3. Selecione "Open with Live Server"

### Método 3: Qualquer servidor web
- Apache, Nginx, ou qualquer servidor HTTP
- Aponte para o diretório do projeto

## Customização

### Alterando Cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --primary-color: #sua-cor;
    --secondary-color: #sua-cor;
    /* ... */
}
```

### Modificando Conteúdo
- Textos: Edite diretamente no `index.html`
- Imagens: Substitua os arquivos PNG
- Estilos: Modifique `styles.css`
- Funcionalidades: Ajuste `script.js`

### Adicionando Seções
1. Adicione HTML na estrutura
2. Crie estilos CSS correspondentes
3. Implemente JavaScript se necessário
4. Atualize navegação

## Manutenção

### Atualizações Recomendadas
- Substituir placeholders por conteúdo real
- Adicionar fotos reais dos sócios
- Conectar formulário a backend
- Implementar analytics
- Adicionar SEO meta tags específicas

### Monitoramento
- Performance (Core Web Vitals)
- Acessibilidade (WAVE, axe)
- Compatibilidade entre navegadores
- Responsividade em dispositivos reais

## Suporte a Navegadores

### Totalmente Suportado
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Parcialmente Suportado
- Internet Explorer 11 (funcionalidades limitadas)
- Navegadores móveis antigos

## Licença e Créditos

- **Desenvolvido por**: Manus AI
- **Cliente**: Geon AI
- **Ano**: 2026
- **Licença**: Proprietária

## Contato para Suporte

Para dúvidas sobre implementação ou customização:
- Consulte esta documentação
- Verifique comentários no código
- Teste em ambiente local antes de deploy

---

**Nota**: Este site foi desenvolvido seguindo as melhores práticas de desenvolvimento web moderno, com foco em performance, acessibilidade e experiência do usuário.

