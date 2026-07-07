# Guía de Despliegue Automatizado

Este proyecto utiliza **GitHub Actions** para desplegar automáticamente la lógica del ChatBot (Edge Functions) a Supabase de manera profesional y segura.

## Configuración Única (One-Time Setup)

Para que el despliegue automático funcione, necesitas agregar los siguientes secretos en tu repositorio de GitHub:

1.  Ve a tu repositorio en GitHub.
2.  Navega a **Settings** > **Secrets and variables** > **Actions**.
3.  Haz clic en **New repository secret** y añade las siguientes claves:

| Nombre del Secreto | Descripción | Dónde encontrarlo |
| :--- | :--- | :--- |
| `SUPABASE_ACCESS_TOKEN` | Tu token personal para controlar Supabase. | [Supabase Dashboard](https://supabase.com/dashboard/account/tokens) > Access Tokens |
| `SUPABASE_PROJECT_ID` | El ID único de tu proyecto. | URL del dashboard: `https://supabase.com/dashboard/project/<PROJECT_ID>` |
| `OPENROUTER_API_KEY` | Tu clave de API para usar los modelos de IA. | [OpenRouter Keys](https://openrouter.ai/keys) |

## Flujo de Trabajo

Una vez configurados los secretos:

*   Cada vez que hagas un `git push` a la rama `main` o `master` que contenga cambios en la carpeta `supabase/functions`, GitHub Actions se activará.
*   Automáticamente desplegará la función actualizada y configurará las claves de seguridad en Supabase.
*   No necesitas instalar nada en tu ordenador local.
