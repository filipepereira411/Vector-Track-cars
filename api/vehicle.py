from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        # 1. Parse aos parâmetros da query (ex: ?matricula=XX-XX-XX)
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        matricula = query_params.get('matricula', [None])[0]

        if not matricula:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {"error": "A matrícula é obrigatória."}
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return

        # Obter o Token das variáveis de ambiente da Vercel
        api_token = os.environ.get('MATRICULAZ_TOKEN', '')

        # 2. Configurar o pedido para a API externa (ajusta o URL conforme necessário)
        url_api_externa = f"https://matriculaz.pt{matricula}"
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

        req = urllib.request.Request(url_api_externa, headers=headers, method='GET')

        try:
            # Fazer o pedido real à API externa
            with urllib.request.urlopen(req) as response_api:
                data = json.loads(response_api.read().decode('utf-8'))
                
                # Devolver os dados com sucesso (200 OK) para o teu frontend
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                # Configuração de CORS caso o teu HTML esteja noutro domínio durante testes
                self.send_header('Access-Control-Allow-Origin', '*') 
                self.end_headers()
                self.wfile.write(json.dumps(data).encode('utf-8'))

        except urllib.error.HTTPError as e:
            # Tratar erros HTTP da API externa (ex: 404, 401)
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {"error": "Erro ao consultar a API externa", "status_code": e.code}
            self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            # Tratar erros internos do servidor proxy
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {"error": "Erro interno no servidor proxy", "detalhes": str(e)}
            self.wfile.write(json.dumps(response).encode('utf-8'))
