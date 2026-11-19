# Fotolivro — configurar o login com Instagram

1. Em developers.facebook.com, crie um app do tipo **Empresa** e adicione o produto **Instagram → API com login do Instagram**.
2. Em "Configurar login comercial", cadastre a URL de redirecionamento: `https://SEU-SITE.netlify.app/fotolivro/ (a página fica em aposentadoria-app/fotolivro)`
3. Na Netlify (Site configuration → Environment variables), crie `IG_CLIENT_ID` e `IG_CLIENT_SECRET` com os dados do app.
4. Enquanto o app estiver em modo de desenvolvimento, só contas adicionadas como "Testadores do Instagram" conseguem entrar. Para o público, envie o app para análise da Meta pedindo `instagram_business_basic`.

A API oficial só funciona para contas **profissionais** (Criador ou Empresa); contas pessoais podem trocar de tipo de graça no app do Instagram.
