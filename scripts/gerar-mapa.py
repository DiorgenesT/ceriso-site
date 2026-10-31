"""Gera src/content/mapa-geo.ts a partir das malhas do IBGE e dos rios do OpenStreetMap.

Fontes (baixadas em _ref/geo/):
  - sp-municipios.geojson: IBGE, API de malhas v3, municípios de SP (qualidade intermediária)
  - codigos.json: códigos IBGE dos 29 consorciados
  - rios.json: Overpass/OSM, rios Tietê, Sorocaba e afluentes + Represa de Itupararanga

Uso: python3 scripts/gerar-mapa.py
"""
import json, math, pathlib

RAIZ = pathlib.Path(__file__).resolve().parents[1]
GEO = RAIZ.parent / "_ref" / "geo"
SAIDA = RAIZ / "src" / "content" / "mapa-geo.ts"

LARGURA = 1000
MARGEM = 0.06  # graus de folga em volta dos consorciados

codigos = json.loads((GEO / "codigos.json").read_text())
por_codigo = {str(v): k for k, v in codigos.items()}
malha = json.loads((GEO / "sp-municipios.geojson").read_text())
rios_osm = json.loads((GEO / "rios.json").read_text())


def aneis(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"][0]]
    return [p[0] for p in geom["coordinates"]]


# Caixa dos 29 consorciados
consorciados = [f for f in malha["features"] if str(f["properties"]["codarea"]) in por_codigo]
assert len(consorciados) == 29, len(consorciados)
xs = [c[0] for f in consorciados for a in aneis(f["geometry"]) for c in a]
ys = [c[1] for f in consorciados for a in aneis(f["geometry"]) for c in a]
lon0, lon1 = min(xs) - MARGEM, max(xs) + MARGEM
lat0, lat1 = max(ys) + MARGEM, min(ys) - MARGEM
fx = math.cos(math.radians((lat0 + lat1) / 2))
escala = LARGURA / ((lon1 - lon0) * fx)
ALTURA = round((lat0 - lat1) * escala)


def proj(c):
    return ((c[0] - lon0) * fx * escala, (lat0 - c[1]) * escala)


def simplificar(pts, tol):
    """Douglas-Peucker."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norma = math.hypot(dx, dy) or 1e-9
    i_max, d_max = 0, 0.0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / norma
        if d > d_max:
            i_max, d_max = i, d
    if d_max <= tol:
        return [pts[0], pts[-1]]
    return simplificar(pts[: i_max + 1], tol)[:-1] + simplificar(pts[i_max:], tol)


def simplificar_anel(pts, tol):
    """Anéis fechados começam e terminam no mesmo ponto: divide no ponto mais distante."""
    k = max(range(len(pts)), key=lambda i: math.dist(pts[0], pts[i]))
    return simplificar(pts[: k + 1], tol)[:-1] + simplificar(pts[k:], tol)


def num(decimos):
    """Décimos inteiros -> texto curto: 12 -> 1.2, -8 -> -.8, 0 -> 0."""
    if decimos == 0:
        return "0"
    sinal = "-" if decimos < 0 else ""
    inteiro, frac = divmod(abs(decimos), 10)
    texto = (str(inteiro) if inteiro else "") + (f".{frac}" if frac else "")
    return sinal + texto


def caminho(pts, fechar):
    """Path em comandos relativos (m/l), arredondado a 0,1: mesma precisão, ~40% menor.
    Os deltas saem das coordenadas já arredondadas, então não há erro acumulado."""
    r = [(round(x * 10), round(y * 10)) for x, y in pts]
    r = [p for i, p in enumerate(r) if i == 0 or p != r[i - 1]]
    s = f"M{num(r[0][0])},{num(r[0][1])}"
    pares = [f"{num(b[0] - a[0])},{num(b[1] - a[1])}" for a, b in zip(r, r[1:])]
    if pares:
        s += "l" + "".join(p if i == 0 or p.startswith("-") else "," + p for i, p in enumerate(pares))
    return s + ("z" if fechar else "")


def dentro_da_caixa(f):
    a = aneis(f["geometry"])[0]
    cx = sum(c[0] for c in a) / len(a)
    cy = sum(c[1] for c in a) / len(a)
    return lon0 - 0.15 < cx < lon1 + 0.15 and lat1 - 0.15 < cy < lat0 + 0.15


def centroide(pts):
    # centroide de polígono (fórmula do laço)
    a = cx = cy = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
        k = x0 * y1 - x1 * y0
        a += k
        cx += (x0 + x1) * k
        cy += (y0 + y1) * k
    a *= 0.5
    return (cx / (6 * a), cy / (6 * a)) if a else pts[0]


slug = lambda s: (
    __import__("unicodedata").normalize("NFD", s).encode("ascii", "ignore").decode().lower().replace(" ", "-")
)

municipios, vizinhos = [], []
for f in malha["features"]:
    cod = str(f["properties"]["codarea"])
    pts_aneis = [[proj(c) for c in a] for a in aneis(f["geometry"])]
    if cod in por_codigo:
        maior = max(pts_aneis, key=len)
        cx, cy = centroide(maior)
        d = "".join(caminho(simplificar_anel(p, 0.9), True) for p in pts_aneis)
        municipios.append({"slug": slug(por_codigo[cod]), "nome": por_codigo[cod], "d": d, "cx": round(cx, 1), "cy": round(cy, 1)})
    elif dentro_da_caixa(f):
        vizinhos.append("".join(caminho(simplificar_anel(p, 2.5), True) for p in pts_aneis))

def comprimento(pts):
    return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))


def encadear(trechos):
    """Junta os trechos (ways) do OSM em cursos contínuos. No OSM cada trecho já vai
    no sentido da correnteza; aqui escolhemos, a partir das nascentes, o caminho mais longo."""
    chave = lambda p: (round(p[0], 5), round(p[1], 5))
    restantes = list(trechos)
    cursos = []
    while restantes:
        fins = {chave(t[-1]) for t in restantes}
        fontes = [t for t in restantes if chave(t[0]) not in fins] or restantes

        def mais_longo(t, vistos):
            seguintes = [u for u in restantes if id(u) not in vistos and chave(u[0]) == chave(t[-1])]
            melhor = []
            for u in seguintes:
                c = mais_longo(u, vistos | {id(u)})
                if sum(map(comprimento, c)) > sum(map(comprimento, melhor)):
                    melhor = c
            return [t] + melhor

        curso = max((mais_longo(t, {id(t)}) for t in fontes), key=lambda c: sum(map(comprimento, c)))
        usados = {id(t) for t in curso}
        restantes = [t for t in restantes if id(t) not in usados]
        cursos.append([p for i, t in enumerate(curso) for p in (t if i == 0 else t[1:])])
    return cursos


def recortar(pts, folga=30):
    """Mantém só os trechos dentro do quadro (com folga), para a água entrar pela borda."""
    dentro = lambda p: -folga <= p[0] <= LARGURA + folga and -folga <= p[1] <= ALTURA + folga
    partes, atual = [], []
    for p in pts:
        if dentro(p):
            atual.append(p)
        elif atual:
            partes.append(atual)
            atual = []
    return partes + ([atual] if atual else [])


trechos = {}
for e in rios_osm["elements"]:
    nome = e.get("tags", {}).get("name", "")
    if e["type"] == "way" and e.get("tags", {}).get("waterway") == "river":
        trechos.setdefault(nome, []).append([proj((g["lon"], g["lat"])) for g in e["geometry"]])

rios = {}
for nome, lista in trechos.items():
    for curso in encadear(lista):
        for parte in recortar(curso):
            pts = simplificar(parte, 2.2)
            if comprimento(pts) > 12:
                rios.setdefault(nome, []).append(pts)
# Pedaços muito menores que o curso principal (o leito sob a represa, braços soltos) só poluem.
for nome, cursos in rios.items():
    maior = max(map(comprimento, cursos))
    rios[nome] = sorted((c for c in cursos if comprimento(c) > 0.15 * maior), key=comprimento, reverse=True)
represa = []
for e in rios_osm["elements"]:
    if e["type"] == "relation":
        for m in e["members"]:
            if m.get("role") == "outer" and "geometry" in m:
                represa.append(caminho(simplificar([proj((g["lon"], g["lat"])) for g in m["geometry"]], 0.9), False))

# Contorno da região: as arestas do IBGE que pertencem a um só município (as divisas
# internas aparecem duas vezes). Serve de base para a "espessura" do bloco.
arestas = {}
for f in consorciados:
    for a in aneis(f["geometry"]):
        for p, q in zip(a, a[1:]):
            k = frozenset((tuple(p), tuple(q)))
            arestas[k] = arestas.get(k, 0) + 1
vizinhanca = {}
for k, n in arestas.items():
    if n == 1:
        p, q = tuple(k)
        vizinhanca.setdefault(p, []).append(q)
        vizinhanca.setdefault(q, []).append(p)
contorno, livres = [], set(vizinhanca)
while livres:
    inicio = livres.pop()
    anel, atual, anterior = [inicio], inicio, None
    while True:
        prox = next((v for v in vizinhanca[atual] if v != anterior and (v in livres or v == inicio)), None)
        if prox is None or prox == inicio:
            break
        livres.discard(prox)
        anel.append(prox)
        anterior, atual = atual, prox
    if len(anel) > 10:
        pts = [proj(c) for c in anel]
        contorno.append(caminho(simplificar_anel(pts + pts[:1], 0.9), True))

ID_RIO = {"Rio Tietê": "tiete", "Rio Sorocaba": "sorocaba"}
id_rio = lambda nome: ID_RIO.get(nome) or slug(nome.removeprefix("Rio "))

# Onde e quando a água chega a cada município: ponto de rio mais próximo do centro,
# com a fração do curso já percorrida (0 = nascente/entrada, 1 = foz/saída).
for m in municipios:
    melhor = None
    for nome, cursos in rios.items():
        for pts in cursos:
            total = comprimento(pts) or 1
            acumulado = 0.0
            for a, b in zip(pts, pts[1:]):
                dist = math.dist((m["cx"], m["cy"]), a)
                if melhor is None or dist < melhor[2]:
                    melhor = (id_rio(nome), acumulado / total, dist)
                acumulado += math.dist(a, b)
    m["rio"], m["fracao"], m["distancia"] = melhor[0], round(melhor[1], 3), round(melhor[2] / LARGURA, 3)

saida = {
    "largura": LARGURA,
    "altura": ALTURA,
    "municipios": sorted(municipios, key=lambda m: m["slug"]),
    "contorno": "".join(contorno),
    "vizinhos": "".join(vizinhos),
    # um curso por item, no sentido da correnteza
    "rios": [{"id": id_rio(nome), "cursos": [caminho(p, False) for p in cursos]} for nome, cursos in rios.items()],
    "represa": "".join(represa),
}

SAIDA.write_text(
    "// Gerado por scripts/gerar-mapa.py — não editar à mão.\n"
    "// Divisas: IBGE (malhas municipais). Rios e represa: © colaboradores do OpenStreetMap (ODbL).\n"
    f"export const mapaGeo = {json.dumps(saida, ensure_ascii=False)} as const;\n"
)
print(f"ok: {LARGURA}x{ALTURA}, {len(municipios)} consorciados, {len(vizinhos)} vizinhos, {len(contorno)} anéis de contorno, "
      f"rios={ {k: len(v) for k, v in rios.items()} }, "
      f"{SAIDA.stat().st_size / 1024:.0f} KB")
