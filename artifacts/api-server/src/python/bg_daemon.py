#!/usr/bin/env python3
"""
High-performance in-memory rembg daemon.
Uses single-worker sequential HTTPServer + tuned ONNX SessionOptions
to prevent CPU thread contention and keep latency rock-solid (~2s).
"""
import sys
import os
import io
import time
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

try:
    from rembg import remove, new_session
    import onnxruntime as ort
    from PIL import Image
except ImportError as exc:
    sys.stderr.write(f"[bg_daemon] Import error: {exc}\n")
    sys.exit(1)

MODEL_NAME = os.environ.get("REMBG_MODEL", "isnet-general-use")
PORT = int(os.environ.get("REMBG_DAEMON_PORT", 5005))
HOST = os.environ.get("REMBG_DAEMON_HOST", "127.0.0.1")

# Optimal ONNX CPU settings: avoid over-subscription across physical cores
sess_opts = ort.SessionOptions()
cpu_threads = min(8, max(2, os.cpu_count() or 4))
sess_opts.intra_op_num_threads = cpu_threads
sess_opts.inter_op_num_threads = 1
sess_opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
sess_opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

print(f"[bg_daemon] Pre-loading model '{MODEL_NAME}' into RAM (threads={cpu_threads})...", flush=True)
SESSION = new_session(MODEL_NAME, sess_opts)

# Warmup JIT compiler and ONNX session graph
dummy = Image.new("RGB", (64, 64), (255, 0, 0))
buf = io.BytesIO()
dummy.save(buf, format="PNG")
remove(buf.getvalue(), session=SESSION)
print(f"[bg_daemon] Model '{MODEL_NAME}' resident in RAM and fully warmed up.", flush=True)

class RembgHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b"{\"status\":\"ready\"}\n")
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/remove":
            t0 = time.time()
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                if content_length <= 0:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(b"{\"error\":\"Empty request body\"}\n")
                    return

                input_bytes = self.rfile.read(content_length)
                t_read = time.time()
                
                result_bytes = remove(input_bytes, session=SESSION)
                t_infer = time.time()

                self.send_response(200)
                self.send_header("Content-Type", "image/png")
                self.send_header("Content-Length", str(len(result_bytes)))
                self.end_headers()
                self.wfile.write(result_bytes)
                
                total_time = time.time() - t0
                infer_time = t_infer - t_read
                print(f"[bg_daemon] Processed {len(input_bytes)}B -> {len(result_bytes)}B (infer: {infer_time:.3f}s, total: {total_time:.3f}s)", flush=True)
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                err_dict = {"error": str(e)}
                self.wfile.write((json.dumps(err_dict) + "\n").encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

def main():
    server = HTTPServer((HOST, PORT), RembgHandler)
    print(f"[bg_daemon] Listening on http://{HOST}:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    main()
