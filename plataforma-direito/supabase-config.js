// Configuração do Supabase (pública por natureza: identifica o projeto; a proteção está nas regras de acesso do banco, em supabase.sql).
// Vem de: Supabase → Project Settings → API Keys (chave "publishable"). NUNCA colocar aqui a chave secreta (sb_secret_… / service_role).
window.SUPABASE_CONFIG = {
  url: "https://apgrgbotrrhtxfhcjsgq.supabase.co",
  anonKey: "sb_publishable_DmfEqquL-n4VPBaTpbPumw_sSC6gmnW",
  google: "auto", // mostra "Entrar com Google" quando o provedor estiver ligado no Supabase
  googleClientId: "491578847701-hgf139r9a15olip0d0n7fs7va3kj7hpp.apps.googleusercontent.com", // público por natureza (Drive e login)
};
