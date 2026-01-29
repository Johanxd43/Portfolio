# Instrucciones para Desplegar el ChatBot con Supabase Edge Functions

Para que el ChatBot funcione correctamente con OpenRouter, necesitas desplegar la función de backend que hemos creado. Sigue estos pasos en tu terminal:

## 1. Prerrequisitos
Asegúrate de tener instalada la CLI de Supabase y de haber iniciado sesión:
```bash
npm install -g supabase
supabase login
```

## 2. Vincular el proyecto
Si aún no has vinculado tu proyecto local con el proyecto de Supabase en la nube:
```bash
supabase link --project-ref <tu-project-id>
```
*(Puedes encontrar tu Project ID en la URL de tu dashboard de Supabase: https://supabase.com/dashboard/project/<project-id>)*

## 3. Configurar la Clave de API de OpenRouter
Debes guardar tu clave de OpenRouter como un "secreto" en Supabase para que la función pueda usarla de forma segura:

```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-tu-clave-aqui
```

## 4. Desplegar la Función
Sube la función a la nube:

```bash
supabase functions deploy chat-completion
```

¡Listo! Tu ChatBot ahora usará esta función segura para comunicarse con la IA.
