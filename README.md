# Vector-Track-cars
Com base em https://matriculaz.pt/ + https://autodna.pt
# VectorTrack

Aplicação de demonstração para consultar dados de veículos através da API Matriculaz.

## Configuração na Vercel

1. Em **Project Settings → Environment Variables**, crie `MATRICULAZ_TOKEN` com o token Bearer fornecido pelo administrador da integração Matriculaz.
2. Faça um novo deploy para disponibilizar a variável na função.
3. Na aplicação, introduza uma matrícula portuguesa ou VIN para consultar os dados e adicionar o veículo.

O token é usado apenas pela função de servidor em `api/vehicle.js`; não o coloque no HTML. A consulta usa `POST /api/vehicles/data/license-plate` para matrículas e `POST /api/vehicles/data/license-plate/vin` para VINs.

Os dados da API não incluem localização GPS nem comandos remotos. O mapa e os controlos apresentados na aplicação são demonstrações e não localizam nem controlam veículos.
