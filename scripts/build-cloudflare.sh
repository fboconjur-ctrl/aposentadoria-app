#!/usr/bin/env bash
# Monta a pasta "dist" publicada pela Cloudflare Pages: só o que é público.
# Na Cloudflare: Build command = bash scripts/build-cloudflare.sh · Build output directory = dist
set -euo pipefail
cd "$(dirname "$0")/.."
DIST=dist
mkdir -p "$DIST"
cp -R plataforma-direito aposentadoria-app 404.html favicon.svg compartilhar.png robots.txt sitemap.xml "$DIST"/

# Arquivos internos não vão para o site (anotações, banco, revisão, testes).
for interno in \
  "$DIST/plataforma-direito/CONTINUAR.md" \
  "$DIST/plataforma-direito/README.md" \
  "$DIST/plataforma-direito/supabase.sql" \
  "$DIST/plataforma-direito/conteudo" \
  "$DIST/plataforma-direito/ferramentas" \
  "$DIST/plataforma-direito/skills" \
  "$DIST/plataforma-direito/escritorio/dac/testes"; do
  if [ -e "$interno" ]; then rm -r -- "$interno"; fi
done

cat > "$DIST/_redirects" <<'EOF'
/                /plataforma-direito/          301
/simulador       /aposentadoria-app/           200
/treinamentos    /plataforma-direito/treinamentos/   301
/cursos          /plataforma-direito/cursos/   301
/simulador/*     /aposentadoria-app/:splat     200
EOF

cat > "$DIST/_headers" <<'EOF'
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000

/plataforma-direito/escritorio/*
  X-Robots-Tag: noindex, nofollow
  Referrer-Policy: no-referrer

/plataforma-direito/minha-area/*
  X-Robots-Tag: noindex, nofollow
  Referrer-Policy: no-referrer
EOF
# Uma página de texto por situação (Google) e o sitemap com todas elas.
node scripts/gerar-paginas.js "$DIST"
echo "dist pronto"
