# build_report.py — 将 Word 运营优化建议书转换为同主题的独立网页（public/report-2023.html）
import base64, re
from docx import Document
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph
from docx.table import Table

SRC = r"C:/Users/Administrator/Downloads/2023年度自动售货机运营优化建议书.docx"
OUT = r"C:/Users/Administrator/WorkBuddy/2026-07-21-10-48-09/ai-merchandising-agent/public/report-2023.html"

doc = Document(SRC)

def esc(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def run_html(r):
    t = esc(r.text)
    if not t:
        return ""
    if r.bold:
        t = f"<strong>{t}</strong>"
    if r.italic:
        t = f"<em>{t}</em>"
    if r.underline:
        t = f"<u>{t}</u>"
    return t

def para_inline(p):
    parts = []
    for r in p.runs:
        parent = r._element.getparent()
        if parent is not None and parent.tag == qn("w:hyperlink"):
            rid = parent.get(qn("r:id"))
            rel = doc.part.rels.get(rid) if rid else None
            href = rel.target_ref if rel else None
            txt = run_html(r)
            if href:
                parts.append(f'<a href="{esc(href)}" target="_blank" rel="noopener">{txt}</a>')
            else:
                parts.append(txt)
        else:
            parts.append(run_html(r))
    return "".join(parts)

def style_name(p):
    try:
        return p.style.name if p.style else None
    except Exception:
        return None

def heading_level(sn):
    if not sn:
        return None
    if sn == "Title":
        return 1
    m = re.match(r"Heading\s*(\d)", sn)
    if m:
        return int(m.group(1))
    return None

def images_in(el):
    out = []
    for drawing in el.iter(qn("w:drawing")):
        blip = None
        for b in drawing.iter(qn("a:blip")):
            blip = b
            break
        if blip is None:
            continue
        rid = blip.get(qn("r:embed"))
        if rid and rid in doc.part.related_parts:
            part = doc.part.related_parts[rid]
            blob = part.blob
            ct = getattr(part, "content_type", "") or ""
            ext = "png"
            if "png" in ct:
                ext = "png"
            elif "jpeg" in ct or "jpg" in ct:
                ext = "jpeg"
            elif "gif" in ct:
                ext = "gif"
            b64 = base64.b64encode(blob).decode()
            out.append(f'<img src="data:image/{ext};base64,{b64}" alt="报告配图" />')
    return out

blocks = []
page_title = ""
cur_list = None  # [tag, [items]]

def flush_list():
    global cur_list
    if cur_list:
        items = "".join(f"<li>{i}</li>" for i in cur_list[1])
        blocks.append(f"<{cur_list[0]}>{items}</{cur_list[0]}>")
        cur_list = None

for child in doc.element.body.iterchildren():
    if child.tag == qn("w:p"):
        p = Paragraph(child, doc)
        sn = style_name(p)
        hl = heading_level(sn)
        inline = para_inline(p)
        imgs = images_in(child)
        if hl:
            flush_list()
            if not page_title and inline.strip():
                page_title = re.sub(r"<[^>]+>", "", inline)
            blocks.append(f"<h{hl}>{inline}</h{hl}>")
            continue
        if sn and "List" in sn:
            ltype = "ol" if "Number" in sn else "ul"
            if cur_list is None:
                cur_list = [ltype, []]
            elif cur_list[0] != ltype:
                flush_list()
                cur_list = [ltype, []]
            item = inline + ("".join(imgs) if imgs else "")
            cur_list[1].append(item)
            continue
        flush_list()
        if inline or imgs:
            blocks.append(f"<p>{inline}{''.join(imgs)}</p>")
    elif child.tag == qn("w:tbl"):
        flush_list()
        tbl = Table(child, doc)
        ncols = max(len(row.cells) for row in tbl.rows)
        # Word 单列表格多用作「洞察/提示」框，渲染为 callout 而非表格
        if ncols == 1:
            items = []
            for row in tbl.rows:
                ctext = esc(row.cells[0].text).replace("\n", "<br/>")
                items.append(f"<p>{ctext}</p>")
            blocks.append(f'<div class="rpt-callout">{"".join(items)}</div>')
            continue
        rows = []
        for ri, row in enumerate(tbl.rows):
            cells = []
            for cell in row.cells:
                ctext = esc(cell.text).replace("\n", "<br/>")
                tag = "th" if ri == 0 else "td"
                cells.append(f"<{tag}>{ctext}</{tag}>")
            rows.append("<tr>" + "".join(cells) + "</tr>")
        blocks.append(
            '<table class="rpt-table"><thead>' + rows[0] + "</thead><tbody>"
            + "".join(rows[1:]) + "</tbody></table>"
        )

flush_list()
body_html = "\n".join(blocks)
page_title = page_title or "2023 年度自动售货机运营优化建议书"

HTML = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{esc(page_title)}</title>
<style>
  :root {{
    --bg: #0a0e1a; --bg-soft: #111728; --card: #141b30; --card-2: #1a2342;
    --border: #25304f; --text: #e8ecf6; --muted: #93a0bd;
    --accent: #4a63ff; --accent-strong: #1d30c7; --accent-2: #ff6a00;
    --shadow: 0 10px 40px rgba(0,0,0,.45);
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; background: radial-gradient(1200px 600px at 70% -10%, #1d2a5e 0%, transparent 60%), var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    line-height: 1.75;
  }}
  .topbar {{
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 22px; border-bottom: 1px solid var(--border);
    background: rgba(10,14,26,.7); backdrop-filter: blur(6px); position: sticky; top: 0; z-index: 10;
  }}
  .brand {{ display: flex; align-items: center; gap: 10px; }}
  .brand img {{ height: 22px; }}
  .brand .t {{ font-weight: 700; font-size: 15px; }}
  .brand .s {{ color: var(--muted); font-size: 12px; margin-left: 4px; }}
  .back {{ color: var(--accent); text-decoration: none; font-weight: 600; font-size: 14px; }}
  .print-btn {{
    margin-left: 12px; border: 1px solid var(--border); background: var(--card-2); color: var(--text);
    border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; text-decoration: none;
  }}
  .print-btn:hover {{ border-color: var(--accent); }}
  .container {{ max-width: 920px; margin: 28px auto 80px; padding: 0 20px; }}
  .report {{
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    padding: 36px 40px; box-shadow: var(--shadow);
  }}
  .report h1 {{ font-size: 27px; line-height: 1.35; margin: 0 0 18px; padding-bottom: 14px;
    border-bottom: 2px solid var(--accent-2); color: #fff; }}
  .report h2 {{ font-size: 21px; margin: 34px 0 12px; color: #fff;
    border-left: 4px solid var(--accent); padding-left: 12px; }}
  .report h3 {{ font-size: 17px; margin: 24px 0 8px; color: var(--accent-2); }}
  .report h4 {{ font-size: 15px; margin: 18px 0 6px; color: var(--text); }}
  .report p {{ margin: 12px 0; color: var(--text); }}
  .report ul, .report ol {{ margin: 12px 0; padding-left: 26px; }}
  .report li {{ margin: 6px 0; }}
  .report img {{ max-width: 100%; border-radius: 10px; margin: 16px 0; border: 1px solid var(--border); }}
  .report a {{ color: var(--accent); }}
  .report table.rpt-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; overflow: hidden; border-radius: 10px; }}
  .report table.rpt-table th, .report table.rpt-table td {{
    border: 1px solid var(--border); padding: 9px 11px; text-align: left; vertical-align: top;
  }}
  .report table.rpt-table th {{ background: var(--card-2); color: #fff; font-weight: 700; }}
  .report table.rpt-table tbody tr:nth-child(even) {{ background: var(--bg-soft); }}
  .report .rpt-callout {{
    border-left: 4px solid var(--accent-2); background: var(--bg-soft);
    border-radius: 8px; padding: 12px 16px; margin: 18px 0; color: var(--text);
  }}
  .report .rpt-callout p {{ margin: 6px 0; }}
  @media (max-width: 640px) {{ .report {{ padding: 22px 18px; }} .brand .s {{ display: none; }} }}
</style>
</head>
<body>
  <div class="topbar">
    <div class="brand">
      <img src="/assets/vendsolution-horizontal-white.svg" alt="VendSolution" />
      <span class="t">AI 选品大脑</span><span class="s">· 运营优化建议书</span>
    </div>
    <div>
      <a class="print-btn" href="javascript:window.print()">🖨 导出 PDF</a>
      <a class="back" href="/">← 返回</a>
    </div>
  </div>
  <div class="container">
    <article class="report">
{body_html}
    </article>
  </div>
</body>
</html>
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(HTML)

print("WROTE", OUT, "bytes=", len(HTML.encode("utf-8")), "blocks=", len(blocks))
