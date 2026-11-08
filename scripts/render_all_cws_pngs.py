import os
import re
from PIL import Image, ImageDraw, ImageFont

# 1. Output directory
OUT_DIR = "cws_store_assets"
os.makedirs(OUT_DIR, exist_ok=True)

# 2. Load Assets
im_icon = Image.open("assets/toolkit/icon128.png").convert("RGBA")
im_elon = Image.open("assets/toolkit/feed_elon_starship.jpg").convert("RGB")
im_elon_avatar = Image.open("assets/toolkit/feed_elon_avatar.jpg").convert("RGB")
im_cr7_avatar = Image.open("assets/toolkit/feed_cr7_avatar.jpg").convert("RGB")
im_hug = Image.open("assets/toolkit/feed_cr7_messi_hug_opt.jpg").convert("RGB")
im_ad = Image.open("assets/toolkit/feed_ad_ugly_vpn.jpg").convert("RGB")
im_taylor_avatar = Image.open("assets/toolkit/feed_taylor_avatar.png").convert("RGBA")
im_nasa_avatar = Image.open("assets/toolkit/feed_nasa_avatar.png").convert("RGBA")
im_nasa = Image.open("assets/toolkit/feed_nasa_cosmos.jpg").convert("RGB")

# 3. Fonts selector per locale
def get_font(locale, size, bold=False):
    if locale in ['en-US', 'es', 'fr', 'de']:
        p = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
        return ImageFont.truetype(p, size)
    elif locale == 'ja':
        p = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc" if bold else "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
        try:
            return ImageFont.truetype(p, size)
        except:
            return ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", size)
    elif locale == 'ko':
        try:
            return ImageFont.truetype("/System/Library/Fonts/AppleSDGothicNeo.ttc", size)
        except:
            return ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", size)
    else:  # zh-CN, zh-TW
        return ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", size)

def wrap_text(text, font, max_width):
    pattern = re.compile(r'([\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]|[^\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\s]+|\s+)')
    tokens = pattern.findall(text)
    lines = []
    current_line = ''
    for token in tokens:
        if token == '\n':
            lines.append(current_line.strip())
            current_line = ''
            continue
        test_line = current_line + token
        bbox = font.getbbox(test_line)
        w = bbox[2] - bbox[0]
        if w > max_width and current_line.strip():
            lines.append(current_line.strip())
            current_line = token.lstrip()
        else:
            current_line = test_line
    if current_line.strip():
        lines.append(current_line.strip())
    return lines

def draw_round_rect(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def draw_checkmark(draw, cx, cy, r, color='#00E5FF'):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    draw.line([cx - r*0.4, cy, cx - r*0.1, cy + r*0.35], fill='#070B14', width=max(1, int(r*0.25)))
    draw.line([cx - r*0.1, cy + r*0.35, cx + r*0.45, cy - r*0.35], fill='#070B14', width=max(1, int(r*0.25)))

def draw_verified_badge(draw, cx, cy, r, color='#1D9BF0'):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    draw.line([cx - r*0.45, cy, cx - r*0.1, cy + r*0.4], fill='#FFFFFF', width=max(1, int(r*0.3)))
    draw.line([cx - r*0.1, cy + r*0.4, cx + r*0.5, cy - r*0.35], fill='#FFFFFF', width=max(1, int(r*0.3)))

def draw_x_logo(draw, cx, cy, size=18, color='#FFFFFF'):
    s = size / 2
    draw.line([cx - s, cy - s, cx + s, cy + s], fill=color, width=2)
    draw.line([cx + s, cy - s, cx - s, cy + s], fill=color, width=2)

def draw_browser_shell(im, draw, bx, by, bw, bh, title, locale):
    draw_round_rect(draw, [bx, by, bx + bw, by + bh], 18, fill='#0B0F19', outline='#1E293B', width=2)
    draw.line([bx, by + 44, bx + bw, by + 44], fill='#1E293B', width=1)
    draw.ellipse([bx + 16, by + 16, bx + 26, by + 26], fill='#EF4444')
    draw.ellipse([bx + 34, by + 16, bx + 44, by + 16 + 10], fill='#F59E0B')
    draw.ellipse([bx + 52, by + 16, bx + 62, by + 16 + 10], fill='#10B981')
    draw_round_rect(draw, [bx + 80, by + 10, bx + bw - 60, by + 34], 12, fill='#111827', outline='#1F2937', width=1)
    draw.text((bx + 96, by + 14), f"https://{title}", font=get_font(locale, 11, False), fill='#64748B')
    ic = im_icon.resize((20, 20), Image.Resampling.LANCZOS)
    im.paste(ic, (bx + bw - 42, by + 12), ic)

def draw_pitch_column(im, draw, x, y, width, data, locale):
    curY = y
    ic = im_icon.resize((32, 32), Image.Resampling.LANCZOS)
    im.paste(ic, (x, curY), ic)
    draw.text((x + 42, curY + 6), "HORD", font=get_font(locale, 20, True), fill='#FFFFFF')
    draw.text((x + 104, curY + 6), "X-Toolkit", font=get_font(locale, 20, True), fill='#00E5FF')
    curY += 56

    cat = (data.get('category') or 'PRO CORE FEATURE').upper()
    draw.text((x, curY), cat, font=get_font(locale, 12, True), fill='#00E5FF')
    curY += 28

    raw_hl = (data.get('headline') or '').replace('\\n', '\n')
    for line in raw_hl.split('\n'):
        line_clean = line.strip().rstrip('。').rstrip('.')
        if line_clean:
            draw.text((x, curY), line_clean, font=get_font(locale, 32, True), fill='#FFFFFF')
            curY += 44
    curY += 12

    sub_lines = wrap_text(data.get('subtitle', ''), get_font(locale, 14, False), width)
    for s in sub_lines:
        draw.text((x, curY), s, font=get_font(locale, 14, False), fill='#94A3B8')
        curY += 22
    curY += 14

    for b in data.get('bullets', []):
        draw_checkmark(draw, x + 12, curY + 8, 8, '#00E5FF')
        draw.text((x + 30, curY), b, font=get_font(locale, 13, False), fill='#E2E8F0')
        curY += 30
    curY += 14

    if data.get('actionBadge'):
        badge = data['actionBadge']
        draw_round_rect(draw, [x, curY, x + width, curY + 44], 14, fill='#0B1F2D', outline='#00E5FF', width=1)
        draw.text((x + 20, curY + 14), badge, font=get_font(locale, 12, True), fill='#00E5FF')

mask44 = Image.new('L', (44, 44), 0)
ImageDraw.Draw(mask44).ellipse([0, 0, 44, 44], fill=255)

print("Base setup loaded")

def render_s1(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#070B14')
    draw = ImageDraw.Draw(im)
    bx, by, bw, bh = 40, 40, 740, 720
    draw_browser_shell(im, draw, bx, by, bw, bh, "x.com/elonmusk", locale)

    railX = bx + 16
    draw.rectangle([railX, by + 45, railX + 54, by + bh - 2], fill='#0D121D')
    draw_x_logo(draw, railX + 27, by + 75, 18, '#FFFFFF')

    postX = bx + 86
    postY = by + 60
    postW = bw - 104

    av = im_elon_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(av, (postX, postY), mask44)

    draw.text((postX + 54, postY + 4), data.get('authorName', 'Elon Musk'), font=get_font(locale, 15, True), fill='#FFFFFF')
    draw_verified_badge(draw, postX + 148, postY + 12, 7)
    draw.text((postX + 162, postY + 5), data.get('authorHandle', '@elonmusk · 3h'), font=get_font(locale, 12, False), fill='#64748B')
    draw.text((postX + postW - 30, postY + 4), "···", font=get_font(locale, 15, True), fill='#64748B')

    draw.text((postX + 54, postY + 34), data.get('tweetText', ''), font=get_font(locale, 13, False), fill='#E2E8F0')

    vidX, vidY, vidW, vidH = postX + 54, postY + 64, postW - 68, 350
    draw_round_rect(draw, [vidX, vidY, vidX + vidW, vidY + vidH], 16, fill='#000000', outline='#1E293B', width=1)

    starship_crop = im_elon.resize((vidW, vidH), Image.Resampling.LANCZOS)
    starship_mask = Image.new('L', (vidW, vidH), 0)
    ImageDraw.Draw(starship_mask).rounded_rectangle([0, 0, vidW, vidH], radius=16, fill=255)
    im.paste(starship_crop, (vidX, vidY), starship_mask)

    draw_round_rect(draw, [vidX + vidW - 130, vidY + 14, vidX + vidW - 14, vidY + 40], 8, fill='#070B14D0', outline='#00E5FF', width=1)
    draw.text((vidX + vidW - 120, vidY + 18), data.get('qualityTag', '4K 60FPS RAW'), font=get_font(locale, 11, True), fill='#00E5FF')

    cx, cy = vidX + vidW // 2, vidY + vidH // 2
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill='#070B14A0', outline='#FFFFFFC0', width=2)
    draw.polygon([(cx - 8, cy - 14), (cx + 16, cy), (cx - 8, cy + 14)], fill='#FFFFFF')

    seekY = vidY + vidH - 30
    draw.rectangle([vidX + 16, seekY, vidX + vidW - 16, seekY + 4], fill='#334155')
    draw.rectangle([vidX + 16, seekY, vidX + int(vidW * 0.45), seekY + 4], fill='#00E5FF')
    draw.ellipse([vidX + int(vidW * 0.45) - 4, seekY - 2, vidX + int(vidW * 0.45) + 4, seekY + 6], fill='#FFFFFF')
    draw.text((vidX + 16, seekY - 18), "0:42 / 2:15", font=get_font(locale, 11, False), fill='#E2E8F0')

    toastX, toastY, toastW, toastH = vidX + 16, vidY + vidH - 100, vidW - 32, 54
    draw_round_rect(draw, [toastX, toastY, toastX + toastW, toastY + toastH], 10, fill='#070B14E8', outline='#00E5FF', width=1)
    draw.text((toastX + 16, toastY + 10), data.get('toastTitle', 'DOWNLOADING 4K RAW STREAM'), font=get_font(locale, 10, True), fill='#00E5FF')
    draw.text((toastX + 16, toastY + 28), data.get('toastDesc', ''), font=get_font(locale, 11, False), fill='#94A3B8')
    draw.rectangle([toastX + toastW - 170, toastY + 24, toastX + toastW - 16, toastY + 30], fill='#1E293B')
    draw.rectangle([toastX + toastW - 170, toastY + 24, toastX + toastW - 170 + 105, toastY + 30], fill='#00E5FF')

    actY = vidY + vidH + 18
    metrics = ["18.4K", "52.8K", "410K", "32.5M"]
    mx = vidX
    for count in metrics:
        draw.text((mx, actY + 2), count, font=get_font(locale, 12, False), fill='#64748B')
        mx += 85

    btnX = vidX + vidW - 64
    btnY = actY - 4
    draw.ellipse([btnX, btnY, btnX + 36, btnY + 36], fill='#00E5FF', outline='#38BDF8', width=2)
    draw.polygon([(btnX + 18, btnY + 24), (btnX + 11, btnY + 17), (btnX + 25, btnY + 17)], fill='#070B14')
    draw.rectangle([btnX + 16, btnY + 9, btnX + 20, btnY + 17], fill='#070B14')
    draw.rectangle([btnX + 11, btnY + 25, btnX + 25, btnY + 27], fill='#070B14')

    tt_text = data.get('tooltip', 'Download 4K Video')
    bbox_tt = get_font(locale, 11, True).getbbox(tt_text)
    ttW = (bbox_tt[2] - bbox_tt[0]) + 24
    ttX, ttY, ttH = btnX + 36 - ttW, btnY - 32, 26
    draw_round_rect(draw, [ttX, ttY, ttX + ttW, ttY + ttH], 6, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.text((ttX + 12, ttY + 6), tt_text, font=get_font(locale, 11, True), fill='#0F172A')

    draw_pitch_column(im, draw, 820, 130, 420, data, locale)
    im.save(out_path)

def render_s2(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#070B14')
    draw = ImageDraw.Draw(im)

    draw_pitch_column(im, draw, 60, 130, 400, data, locale)

    bx2, by2, bw2, bh2 = 500, 40, 740, 720
    draw_browser_shell(im, draw, bx2, by2, bw2, bh2, "x.com/Cristiano", locale)

    postX2, postY2, postW2 = bx2 + 40, by2 + 60, bw2 - 80
    av_cr7 = im_cr7_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(av_cr7, (postX2, postY2), mask44)
    draw.text((postX2 + 54, postY2 + 4), data.get('authorName', 'Cristiano Ronaldo'), font=get_font(locale, 15, True), fill='#FFFFFF')
    draw_verified_badge(draw, postX2 + 200, postY2 + 12, 7)
    draw.text((postX2 + 214, postY2 + 5), data.get('authorHandle', '@Cristiano · 4h'), font=get_font(locale, 12, False), fill='#64748B')
    draw.text((postX2 + 54, postY2 + 34), data.get('tweetText', ''), font=get_font(locale, 13, False), fill='#E2E8F0')

    photoH = 340
    hug_crop = im_hug.resize((postW2 - 54, photoH), Image.Resampling.LANCZOS)
    hug_mask = Image.new('L', (postW2 - 54, photoH), 0)
    ImageDraw.Draw(hug_mask).rounded_rectangle([0, 0, postW2 - 54, photoH], radius=14, fill=255)
    im.paste(hug_crop, (postX2 + 54, postY2 + 64), hug_mask)

    dim = Image.new('RGBA', (bw2, bh2 - 45), (7, 11, 20, 175))
    im.paste(dim, (bx2, by2 + 45), dim)

    popW, popH = 460, 470
    popX = bx2 + (bw2 - popW) // 2
    popY = by2 + 110

    draw_round_rect(draw, [popX, popY, popX + popW, popY + popH], 18, fill='#0B111E', outline='#00E5FF', width=2)

    ic_pop = im_icon.resize((26, 26), Image.Resampling.LANCZOS)
    im.paste(ic_pop, (popX + 20, popY + 18), ic_pop)
    draw.text((popX + 54, popY + 20), data.get('modalTitle', 'HORD Media Sniffer'), font=get_font(locale, 15, True), fill='#FFFFFF')
    
    badge_txt = data.get('modalBadge', '4 STREAMS READY')
    draw_round_rect(draw, [popX + popW - 150, popY + 18, popX + popW - 18, popY + 42], 6, fill='#072733', outline='#00E5FF', width=1)
    draw.text((popX + popW - 140, popY + 22), badge_txt, font=get_font(locale, 10, True), fill='#00E5FF')

    draw.line([popX + 18, popY + 54, popX + popW - 18, popY + 54], fill='#1E293B', width=1)

    streams = data.get('streams', [
        ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "4K RAW", "Download", True),
        ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "1080p", "Download", False),
        ("[PNG] 4096×2730", "Lossless Photo · 12.8 MB", "RAW Image", "Download", False),
        ("[MP3] Audio Stream", "320 kbps · 4.8 MB", "Pure MP3", "Extract", False),
    ])

    sy = popY + 70
    colors = ['#00E5FF', '#38BDF8', '#10B981', '#F59E0B']
    for idx, (fmt, info, tag, btn_txt, is_pri) in enumerate(streams):
        col = colors[idx % len(colors)]
        draw_round_rect(draw, [popX + 18, sy, popX + popW - 18, sy + 62], 10, fill='#111927', outline='#1E293B', width=1)
        draw.text((popX + 32, sy + 12), fmt, font=get_font(locale, 13, True), fill='#FFFFFF')
        
        tag_box = get_font(locale, 10, False).getbbox(tag)
        tag_w = (tag_box[2] - tag_box[0]) + 16
        draw_round_rect(draw, [popX + 165, sy + 12, popX + 165 + tag_w, sy + 30], 4, fill='#1E293B')
        draw.text((popX + 173, sy + 14), tag, font=get_font(locale, 10, False), fill=col)
        draw.text((popX + 32, sy + 34), info, font=get_font(locale, 11, False), fill='#94A3B8')
        
        btn_w, btn_h = 80, 32
        btn_x = popX + popW - 18 - btn_w - 12
        btn_y = sy + 15
        if is_pri:
            draw_round_rect(draw, [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], 6, fill='#00E5FF')
            draw.text((btn_x + 12, btn_y + 8), btn_txt, font=get_font(locale, 11, True), fill='#070B14')
        else:
            draw_round_rect(draw, [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], 6, fill='#1E293B', outline='#334155', width=1)
            draw.text((btn_x + 12, btn_y + 8), btn_txt, font=get_font(locale, 11, False), fill='#E2E8F0')
        sy += 72

    batchY = popY + popH - 74
    draw_round_rect(draw, [popX + 18, batchY, popX + popW - 18, batchY + 48], 10, fill='#00E5FF')
    batch_txt = data.get('batchBtn', 'Batch Download All Media (ZIP)')
    b_box = get_font(locale, 13, True).getbbox(batch_txt)
    b_w = b_box[2] - b_box[0]
    draw.text((popX + (popW - b_w) // 2, batchY + 14), batch_txt, font=get_font(locale, 13, True), fill='#070B14')

    im.save(out_path)

def render_s3(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#070B14')
    draw = ImageDraw.Draw(im)

    bx3, by3, bw3, bh3 = 40, 40, 740, 720
    draw_browser_shell(im, draw, bx3, by3, bw3, bh3, "x.com/home", locale)

    postX3, postY3, postW3 = bx3 + 40, by3 + 60, bw3 - 80

    av_taylor = im_taylor_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(av_taylor, (postX3, postY3), mask44)
    draw.text((postX3 + 54, postY3 + 4), "Taylor Swift", font=get_font(locale, 15, True), fill='#FFFFFF')
    draw_verified_badge(draw, postX3 + 154, postY3 + 12, 7)
    draw.text((postX3 + 168, postY3 + 5), "@taylorswift13 · 2h", font=get_font(locale, 12, False), fill='#64748B')
    draw.text((postX3 + 54, postY3 + 30), "The Eras Tour film is available in 4K lossless streaming! Love you all!", font=get_font(locale, 13, False), fill='#E2E8F0')
    draw.line([postX3, postY3 + 60, postX3 + postW3, postY3 + 60], fill='#1E293B', width=1)

    adY3 = postY3 + 74
    adH3 = 280

    ad_crop = im_ad.resize((postW3, adH3), Image.Resampling.LANCZOS)
    ad_mask = Image.new('L', (postW3, adH3), 0)
    ImageDraw.Draw(ad_mask).rounded_rectangle([0, 0, postW3, adH3], radius=14, fill=35)
    im.paste(ad_crop, (postX3, adY3), ad_mask)

    draw_round_rect(draw, [postX3, adY3, postX3 + postW3, adY3 + adH3], 14, fill='#0B1720D8', outline='#10B981', width=2)

    draw_round_rect(draw, [postX3 + 24, adY3 + 24, postX3 + postW3 - 24, adY3 + 80], 10, fill='#064E3B60', outline='#10B981', width=1)
    draw_checkmark(draw, postX3 + 48, adY3 + 52, 10, '#10B981')
    draw.text((postX3 + 68, adY3 + 42), data.get('hudTitle', 'AST AD-SHIELD: Sponsored Ad Shattered'), font=get_font(locale, 14, True), fill='#A7F3D0')

    draw.text((postX3 + 28, adY3 + 104), data.get('hudFeature', 'Pattern: cell.placementTracking.promoted_tweet [100% PURGED]'), font=get_font(locale, 11, False), fill='#6EE7B7')
    draw.text((postX3 + 28, adY3 + 130), data.get('hudDesc', 'Mechanism: Sub-millisecond ancestor node purge with 0% layout shift'), font=get_font(locale, 11, False), fill='#94A3B8')

    pills = [(data.get('hudPill1', 'AST Probe: ACTIVE'), '#10B981'), (data.get('hudPill2', 'Ads: 0% REST'), '#00E5FF'), (data.get('hudPill3', 'CPU: 0.01ms'), '#A7F3D0')]
    px = postX3 + 28
    for label, col in pills:
        draw_round_rect(draw, [px, adY3 + 170, px + 190, adY3 + 204], 6, fill='#062D24', outline=col, width=1)
        draw.text((px + 12, adY3 + 180), label, font=get_font(locale, 11, True), fill=col)
        px += 205

    draw_round_rect(draw, [postX3 + 28, adY3 + 225, postX3 + postW3 - 28, adY3 + 265], 8, fill='#10B981')
    hud_btn = data.get('hudBtn', '100% Pure Ad-Free Timeline Ready')
    hb_box = get_font(locale, 12, True).getbbox(hud_btn)
    hb_w = hb_box[2] - hb_box[0]
    draw.text((postX3 + (postW3 - hb_w) // 2, adY3 + 238), hud_btn, font=get_font(locale, 12, True), fill='#070B14')

    crY3 = adY3 + adH3 + 20
    av_cr7 = im_cr7_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(av_cr7, (postX3, crY3), mask44)
    draw.text((postX3 + 54, crY3 + 4), "Cristiano Ronaldo", font=get_font(locale, 15, True), fill='#FFFFFF')
    draw_verified_badge(draw, postX3 + 200, crY3 + 12, 7)
    draw.text((postX3 + 214, crY3 + 5), "@Cristiano · 4h", font=get_font(locale, 12, False), fill='#64748B')
    draw.text((postX3 + 54, crY3 + 30), "Great team victory tonight! The hard work never stops! #CR7", font=get_font(locale, 13, False), fill='#E2E8F0')

    draw_pitch_column(im, draw, 820, 130, 420, data, locale)
    im.save(out_path)

def render_s4(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#070B14')
    draw = ImageDraw.Draw(im)

    draw_pitch_column(im, draw, 60, 130, 400, data, locale)

    bx4, by4, bw4, bh4 = 500, 40, 740, 720
    draw_browser_shell(im, draw, bx4, by4, bw4, bh4, "x.com/NASA", locale)

    ctrlY = by4 + 60
    draw_round_rect(draw, [bx4 + 20, ctrlY, bx4 + bw4 - 20, ctrlY + 64], 12, fill='#0F172A', outline='#00E5FF', width=1)
    draw.text((bx4 + 36, ctrlY + 14), data.get('sliderLabel', 'Current Width: 1050px (Widescreen Focus)'), font=get_font(locale, 12, True), fill='#00E5FF')

    slX, slY, slW = bx4 + bw4 - 280, ctrlY + 20, 240
    draw.rectangle([slX, slY, slX + slW, slY + 4], fill='#334155')
    draw.rectangle([slX, slY, slX + int(slW * 0.72), slY + 4], fill='#00E5FF')
    draw.ellipse([slX + int(slW * 0.72) - 6, slY - 4, slX + int(slW * 0.72) + 6, slY + 8], fill='#FFFFFF')

    presets = data.get('presets', ["600px Default", "850px Balanced", "1050px Wide [Current]", "1400px Ultra"])
    prX = bx4 + 36
    for pr in presets:
        is_cur = ("当前" in pr) or ("Current" in pr) or ("Actual" in pr) or ("Actuel" in pr) or ("Aktuell" in pr) or ("[当前]" in pr)
        bg = '#0B3040' if is_cur else '#1E293B'
        col = '#00E5FF' if is_cur else '#94A3B8'
        pb_box = get_font(locale, 10, is_cur).getbbox(pr)
        w_p = (pb_box[2] - pb_box[0]) + 18
        draw_round_rect(draw, [prX, ctrlY + 38, prX + w_p, ctrlY + 56], 4, fill=bg)
        draw.text((prX + 9, ctrlY + 42), pr, font=get_font(locale, 10, is_cur), fill=col)
        prX += w_p + 10

    feedX, feedY, feedW, feedH = bx4 + 20, ctrlY + 80, bw4 - 40, bh4 - 165
    draw_round_rect(draw, [feedX, feedY, feedX + feedW, feedY + feedH], 14, fill='#0B111E', outline='#1E293B', width=1)

    av_nasa = im_nasa_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(av_nasa, (feedX + 20, feedY + 20), mask44)
    draw.text((feedX + 74, feedY + 22), "NASA Cosmos", font=get_font(locale, 15, True), fill='#FFFFFF')
    draw_verified_badge(draw, feedX + 188, feedY + 30, 7)
    draw.text((feedX + 202, feedY + 23), "@NASA · 5h", font=get_font(locale, 12, False), fill='#64748B')
    draw.text((feedX + 74, feedY + 48), data.get('tweetText', 'From ISS: Earth city lights and atmospheric glow. Ultrawide 1050px centered feed.'), font=get_font(locale, 12, False), fill='#E2E8F0')

    panoH = feedH - 120
    nasa_crop = im_nasa.resize((feedW - 40, panoH), Image.Resampling.LANCZOS)
    nasa_mask = Image.new('L', (feedW - 40, panoH), 0)
    ImageDraw.Draw(nasa_mask).rounded_rectangle([0, 0, feedW - 40, panoH], radius=12, fill=255)
    im.paste(nasa_crop, (feedX + 20, feedY + 80), nasa_mask)

    draw_round_rect(draw, [feedX + feedW - 190, feedY + 95, feedX + feedW - 35, feedY + 125], 6, fill='#070B14D8', outline='#00E5FF', width=1)
    draw.text((feedX + feedW - 180, feedY + 102), "1050px WIDESCREEN", font=get_font(locale, 11, True), fill='#00E5FF')

    im.save(out_path)

def render_s5(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#070B14')
    draw = ImageDraw.Draw(im)

    bx5, by5, bw5, bh5 = 40, 40, 740, 720
    draw_browser_shell(im, draw, bx5, by5, bw5, bh5, "x.com/home", locale)

    postX5, postY5, postW5 = bx5 + 40, by5 + 60, bw5 - 80

    draw_round_rect(draw, [postX5, postY5, postX5 + postW5, postY5 + 150], 14, fill='#0B1320', outline='#00E5FF', width=2)
    draw.text((postX5 + 24, postY5 + 18), "KEYWORD VAPORIZER RADAR", font=get_font(locale, 14, True), fill='#00E5FF')
    draw.text((postX5 + postW5 - 140, postY5 + 18), "● ACTIVE SHIELD", font=get_font(locale, 11, True), fill='#10B981')

    chips = ["#剧透", "#空投", "#八卦", "#诈骗", "#打投", "#黑粉", "#炒作"] if locale in ['zh-CN', 'zh-TW'] else (
        ["#ネタバレ", "#エアドロ", "#ゴシップ", "#詐欺", "#煽り", "#スパム"] if locale == 'ja' else (
            ["#스포일러", "#에어드랍", "#찌라시", "#사기", "#도배", "#스팸"] if locale == 'ko' else [
                "#spoiler", "#crypto", "#giveaway", "#drama", "#scam", "#bot"
            ]
        )
    )
    cx5 = postX5 + 24
    cy5 = postY5 + 50
    for ch in chips:
        ch_box = get_font(locale, 11, True).getbbox(ch)
        cw = (ch_box[2] - ch_box[0]) + 20
        draw_round_rect(draw, [cx5, cy5, cx5 + cw, cy5 + 28], 6, fill='#1E293B', outline='#EF4444', width=1)
        draw.text((cx5 + 10, cy5 + 6), ch, font=get_font(locale, 11, True), fill='#FCA5A5')
        cx5 += cw + 12

    draw.line([postX5 + 20, postY5 + 95, postX5 + postW5 - 20, postY5 + 95], fill='#1E293B', width=1)
    draw.text((postX5 + 24, postY5 + 112), data.get('radarStatus', '18 noisy tweets silently vaporized by radar'), font=get_font(locale, 12, True), fill='#00E5FF')
    draw.text((postX5 + postW5 - 160, postY5 + 112), data.get('radarRatio', 'Signal/Noise: +350%'), font=get_font(locale, 11, True), fill='#10B981')

    muteY = postY5 + 168
    draw_round_rect(draw, [postX5, muteY, postX5 + postW5, muteY + 70], 10, fill='#0A0F1A', outline='#334155', width=1)
    draw.text((postX5 + 24, muteY + 16), data.get('muteNotice', '[RADAR VAPORIZED] Tweet matching rule was vaporized'), font=get_font(locale, 11, True), fill='#64748B')
    draw.text((postX5 + 24, muteY + 40), data.get('muteSub', 'Removed cleanly from timeline without screen flash'), font=get_font(locale, 11, False), fill='#475569')

    sigY = muteY + 86
    draw_round_rect(draw, [postX5, sigY, postX5 + postW5, sigY + 180], 12, fill='#0F172A', outline='#1E293B', width=1)

    draw_round_rect(draw, [postX5 + 20, sigY + 20, postX5 + 64, sigY + 64], 22, fill='#1E293B')
    draw.text((postX5 + 28, sigY + 28), "RF", font=get_font(locale, 14, True), fill='#00E5FF')
    draw.text((postX5 + 76, sigY + 24), "Rust Foundation", font=get_font(locale, 15, True), fill='#FFFFFF')
    draw_verified_badge(draw, postX5 + 210, sigY + 32, 7)
    draw.text((postX5 + 224, sigY + 25), "@rustlang · 1h", font=get_font(locale, 12, False), fill='#64748B')
    draw.text((postX5 + 76, sigY + 54), "Announcing Rust 2026 edition! Zero-cost abstractions, fearless concurrency, and ultra-fast memory safety without garbage collection.", font=get_font(locale, 12, False), fill='#E2E8F0')

    draw_pitch_column(im, draw, 820, 130, 420, data, locale)
    im.save(out_path)

def render_marquee(locale, data, out_path):
    im = Image.new('RGB', (1400, 560), '#070B14')
    draw = ImageDraw.Draw(im)

    ic = im_icon.resize((48, 48), Image.Resampling.LANCZOS)
    im.paste(ic, (70, 70), ic)
    draw.text((70 + 60, 76), "HORD", font=get_font(locale, 26, True), fill='#FFFFFF')
    draw.text((70 + 145, 76), "X-Toolkit", font=get_font(locale, 26, True), fill='#00E5FF')

    draw.text((70, 140), data.get('category', 'ALL-IN-ONE X & THREADS SUPER SUITE'), font=get_font(locale, 12, True), fill='#00E5FF')
    draw.text((70, 172), data.get('headline', ''), font=get_font(locale, 32, True), fill='#FFFFFF')

    draw.text((70, 230), data.get('subtitle1', ''), font=get_font(locale, 15, False), fill='#94A3B8')
    draw.text((70, 258), data.get('subtitle2', ''), font=get_font(locale, 15, False), fill='#94A3B8')

    tags = data.get('tags', ["4K 60FPS DOWNLOAD", "100% AD SHATTER", "1400px CENTER"])
    cols = ['#00E5FF', '#10B981', '#38BDF8']
    tx = 70
    for idx, tag in enumerate(tags):
        col = cols[idx % len(cols)]
        tb = get_font(locale, 12, True).getbbox(tag)
        tw = (tb[2] - tb[0]) + 30
        draw_round_rect(draw, [tx, 320, tx + tw, 366], 8, fill='#0B1724', outline=col, width=1)
        draw.text((tx + 15, 334), tag, font=get_font(locale, 12, True), fill=col)
        tx += tw + 16

    rx, ry, rw, rh = 760, 60, 580, 440
    draw_round_rect(draw, [rx, ry, rx + rw, ry + rh], 18, fill='#0B111E', outline='#00E5FF', width=2)

    star_crop = im_elon.resize((rw - 32, rh - 32), Image.Resampling.LANCZOS)
    star_mask = Image.new('L', (rw - 32, rh - 32), 0)
    ImageDraw.Draw(star_mask).rounded_rectangle([0, 0, rw - 32, rh - 32], radius=12, fill=255)
    im.paste(star_crop, (rx + 16, ry + 16), star_mask)

    draw_round_rect(draw, [rx + 36, ry + rh - 76, rx + rw - 36, ry + rh - 32], 8, fill='#070B14D8', outline='#00E5FF', width=1)
    draw.text((rx + 56, ry + rh - 64), "[4K RAW DOWNLOADER] 3840x2160 · 60FPS · MP4 READY", font=get_font(locale, 12, True), fill='#00E5FF')

    im.save(out_path)

def render_small(locale, data, out_path):
    im = Image.new('RGB', (440, 280), '#070B14')
    draw = ImageDraw.Draw(im)

    draw_round_rect(draw, [10, 10, 430, 270], 16, fill='#0B111E', outline='#00E5FF', width=2)
    ic = im_icon.resize((36, 36), Image.Resampling.LANCZOS)
    im.paste(ic, (28, 26), ic)
    draw.text((72, 32), "HORD X-Toolkit", font=get_font(locale, 17, True), fill='#FFFFFF')

    draw.text((28, 86), data.get('headline', ''), font=get_font(locale, 20, True), fill='#FFFFFF')
    draw.text((28, 124), data.get('subtitle', ''), font=get_font(locale, 11, False), fill='#94A3B8')

    tags = data.get('tags', ["4K MP4", "Ad-Shield", "Dynamic Center"])
    cols = ['#00E5FF', '#10B981', '#38BDF8']
    bgs = ['#0B1D28', '#062D24', '#0C1F38']
    px = 28
    for idx, tag in enumerate(tags):
        col = cols[idx % len(cols)]
        bg = bgs[idx % len(bgs)]
        tb = get_font(locale, 11, True).getbbox(tag)
        tw = (tb[2] - tb[0]) + 20
        draw_round_rect(draw, [px, 162, px + tw, 198], 6, fill=bg, outline=col, width=1)
        draw.text((px + 10, 172), tag, font=get_font(locale, 11, True), fill=col)
        px += tw + 12

    draw.text((28, 228), data.get('footer', 'CHROME WEB STORE OFFICIAL // FREE INSTALL'), font=get_font(locale, 10, True), fill='#00E5FF')
    im.save(out_path)

def render_store_icon(out_path):
    ic = im_icon.resize((128, 128), Image.Resampling.LANCZOS)
    ic.save(out_path)

print("Render functions compiled successfully")

LOCALES_CONFIG = {
    "zh-CN": {
        "s1": {
            "category": "智能流媒体嗅探",
            "headline": "推文视频与原图\n一键极速下载",
            "subtitle": "智能嗅探推文中的音视频与超清大图，在帖子操作栏无缝内嵌极速下载按钮，直连底层原画源。",
            "bullets": [
                "内嵌推文操作栏，无需复制外部链接",
                "最高支持 4K 60FPS 超清视频与无损原图",
                "极速直连流媒体底层，无需跳转等待"
            ],
            "actionBadge": "在推文流直接一键下载",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "星舰第五次试飞筷子夹火箭太震撼了！生命跨越星际的梦想正在成为现实。",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "正在极速导出 4K MP4 (3840x2160) · 48.2 MB/s",
            "tooltip": "下载 4K 超清视频"
        },
        "s2": {
            "category": "多画质嗅探与批量导出",
            "headline": "多分辨率自由选择\n超清 4K 与批量导出",
            "subtitle": "一键嗅探推文所有媒体流，支持 4K、1080p 多档位视频画质选择，并可一键提取高清音频与批量打包导出相册。",
            "bullets": [
                "4K 2160p / 1080p 多画质无损直链下载",
                "支持一键提取 MP3 纯音频流与原始相册",
                "多图推文与长帖一键 ZIP 批量打包导出"
            ],
            "actionBadge": "多分辨率自由选择 · 批量导出",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "今晚伟大的团队胜利！努力永不停止。感谢全球球迷！#CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 STREAMS READY",
            "batchBtn": "批量打包下载全部媒体 (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "最高画质", "立即下载", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "全高清", "导出文件", False),
                ("[PNG] 4096×2730", "无损原画大图 · 12.8 MB", "RAW相片", "导出文件", False),
                ("[MP3] 纯音频流", "320 kbps · 4.8 MB", "原声提取", "导出音频", False),
            ]
        },
        "s3": {
            "category": "AST 祖先节点屏蔽引擎",
            "headline": "毫秒级粉碎广告\n还原纯净时间线",
            "subtitle": "毫秒级直接剔除祖先节点，彻底粉碎商业赞助与欺诈推广。0% 占位残留，零性能损耗。",
            "bullets": [
                "深度 AST 节点探测，100% 拦截推广",
                "消除信息流推广与右侧冗余广告栏",
                "零性能损耗，毫秒级即时生效"
            ],
            "actionBadge": "100% 纯净无广告时间线",
            "hudTitle": "AST AD-SHIELD: 商业推广广告已被毫秒级粉碎",
            "hudFeature": "拦截特征: cell.placementTracking.promoted_tweet [100% 根除]",
            "hudDesc": "处理机制: 祖先 DOM 节点毫秒级精准切除，0% 页面抖动与排版残留",
            "hudPill1": "AST 节点探针: ACTIVE",
            "hudPill2": "赞助推文: 0% 残留",
            "hudPill3": "CPU 损耗: 0.01ms",
            "hudBtn": "100% 纯净无广告时间线已就绪"
        },
        "s4": {
            "category": "动态排版重塑",
            "headline": "动态居中巨幕\n清空左右干扰栏",
            "subtitle": "告别 600px 狭窄逼仄，彻底清空左右臃肿干扰栏。时间线居中展开，享受无拘束的纯净沉浸式阅读。",
            "bullets": [
                "600px - 1400px 时间线宽度无级调节",
                "一键清空左右杂乱侧栏与冗余推荐",
                "完美适配 4K 与带鱼屏大显示器"
            ],
            "actionBadge": "巨幕专注阅读模式",
            "sliderLabel": "当前宽度: 1050px (巨幕专注模式)",
            "presets": ["600px 默认", "850px 舒适", "1050px 巨幕 [当前]", "1400px 超宽"],
            "tweetText": "从空间站俯瞰地球璀璨夜景与地平线光芒。超清巨幕视野，纯净呈现。"
        },
        "s5": {
            "category": "实时噪音切片雷达",
            "headline": "关键词粉碎雷达\n切除剧透与噪音",
            "subtitle": "自定义敏感词与剧透规则，毫秒级自动粉碎无聊八卦、恶意剧透与刷屏欺诈推文。",
            "bullets": [
                "自定义关键词、标签与账户静默规则",
                "毫秒级规则匹配切片，无白屏闪烁",
                "高信噪比纯净时间线，专注真正有价值的内容"
            ],
            "actionBadge": "高信噪比纯净时间线",
            "radarStatus": "18 条违规噪音推文已被雷达毫秒级静默粉碎",
            "radarRatio": "信噪比提升 +350%",
            "muteNotice": "[RADAR VAPORIZED] 匹配规则 #空投 的推文已被毫秒级静默剔除",
            "muteSub": "已从当前时间线无缝抹除，保证视觉零干扰"
        },
        "marquee": {
            "category": "ALL-IN-ONE X & THREADS SUPER SUITE",
            "headline": "4K 视频下载 · 广告粉碎 · 动态居中",
            "subtitle1": "为极客、创作者与阅读爱好者量身打造的推特终极武器。",
            "subtitle2": "突破官方限制，重塑纯净专注视野。",
            "tags": ["4K 60FPS 极速下载", "100% 广告粉碎", "1400px 巨幕居中"]
        },
        "small": {
            "headline": "4K 视频下载 & 广告粉碎",
            "subtitle": "一键保存原画 · 彻底清除推广 · 动态居中",
            "tags": ["4K MP4", "广告屏蔽", "动态居中"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "zh-TW": {
        "s1": {
            "category": "智慧串流媒體探測",
            "headline": "推文影片與原圖\n一鍵極速下載",
            "subtitle": "智慧偵測推文中的影音與超清大圖，在貼文操作列無縫內嵌極速下載按鈕，直連底層原畫源。",
            "bullets": [
                "內嵌推文操作列，無需複製外部連結",
                "最高支援 4K 60FPS 超清影片與無損原圖",
                "極速直連串流媒體底層，無需跳轉等待"
            ],
            "actionBadge": "在推文流直接一鍵下載",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "星艦第五次試飛筷子夾火箭太震撼了！生命跨越星際的夢想正在成為現實。",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "正在極速匯出 4K MP4 (3840x2160) · 48.2 MB/s",
            "tooltip": "下載 4K 超清影片"
        },
        "s2": {
            "category": "多畫質探測與批次匯出",
            "headline": "多解析度自由選擇\n超清 4K 與批次匯出",
            "subtitle": "一鍵探測推文所有媒體串流，支援 4K、1080p 多檔位影片畫質選擇，並可一鍵擷取高畫質音訊與批次打包匯出相簿。",
            "bullets": [
                "4K 2160p / 1080p 多畫質無損直鏈下載",
                "支援一鍵擷取 MP3 純音訊串流與原始相簿",
                "多圖推文與長貼文一鍵 ZIP 批次打包匯出"
            ],
            "actionBadge": "多解析度自由選擇 · 批次匯出",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "今晚偉大的團隊勝利！努力永不停止。感謝全球球迷！#CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 STREAMS READY",
            "batchBtn": "批次打包下載全部媒體 (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "最高畫質", "立即下載", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "全高畫質", "匯出檔案", False),
                ("[PNG] 4096×2730", "無損原畫大圖 · 12.8 MB", "RAW相片", "匯出檔案", False),
                ("[MP3] 純音訊串流", "320 kbps · 4.8 MB", "原聲擷取", "匯出音訊", False),
            ]
        },
        "s3": {
            "category": "AST 祖先節點封鎖引擎",
            "headline": "毫秒級粉碎廣告\n還原純淨時間軸",
            "subtitle": "毫秒級直接剔除祖先節點，徹底粉碎商業贊助與詐欺推廣。0% 佔位殘留，零效能損耗。",
            "bullets": [
                "深度 AST 節點探測，100% 攔截推廣",
                "消除動態時報推廣與右側冗餘廣告欄",
                "零效能損耗，毫秒級即時生效"
            ],
            "actionBadge": "100% 純淨無廣告時間軸",
            "hudTitle": "AST AD-SHIELD: 商業推廣廣告已被毫秒級粉碎",
            "hudFeature": "攔截特徵: cell.placementTracking.promoted_tweet [100% 根除]",
            "hudDesc": "處理機制: 祖先 DOM 節點毫秒級精準切除，0% 版面抖動與排版殘留",
            "hudPill1": "AST 節點探針: ACTIVE",
            "hudPill2": "贊助推文: 0% 殘留",
            "hudPill3": "CPU 損耗: 0.01ms",
            "hudBtn": "100% 純淨無廣告時間軸已就緒"
        },
        "s4": {
            "category": "動態排版重塑",
            "headline": "動態置中巨幕\n清空左右干擾欄",
            "subtitle": "告別 600px 狹窄逼仄，徹底清空左右臃腫干擾欄。時間軸置中展開，享受無拘束的純淨沉浸式閱讀。",
            "bullets": [
                "600px - 1400px 時間軸寬度無級調節",
                "一鍵清空左右雜亂側欄與冗餘推薦",
                "完美適配 4K 與寬螢幕大顯示器"
            ],
            "actionBadge": "巨幕專注閱讀模式",
            "sliderLabel": "當前寬度: 1050px (巨幕專注模式)",
            "presets": ["600px 預設", "850px 舒適", "1050px 巨幕 [當前]", "1400px 超寬"],
            "tweetText": "從太空站俯瞰地球璀璨夜景與地平線光芒。超清巨幕視野，純淨呈現。"
        },
        "s5": {
            "category": "即時噪音切片雷達",
            "headline": "關鍵詞粉碎雷达\n切除爆雷與噪音",
            "subtitle": "自訂敏感詞與爆雷規則，毫秒級自動粉碎無聊八卦、惡意爆雷與洗版詐欺推文。",
            "bullets": [
                "自訂關鍵詞、標籤與帳戶靜音規則",
                "毫秒級規則匹配切片，無白畫面閃爍",
                "高信噪比純淨時間軸，專注真正有價值的內容"
            ],
            "actionBadge": "高信噪比純淨時間軸",
            "radarStatus": "18 條違規噪音推文已被雷達毫秒級靜默粉碎",
            "radarRatio": "信噪比提升 +350%",
            "muteNotice": "[RADAR VAPORIZED] 匹配規則 #空投 的推文已被毫秒級靜默剔除",
            "muteSub": "已從當前時間軸無縫抹除，保證視覺零干擾"
        },
        "marquee": {
            "category": "ALL-IN-ONE X & THREADS SUPER SUITE",
            "headline": "4K 影片下載 · 廣告粉碎 · 動態置中",
            "subtitle1": "為極客、創作者與閱讀愛好者量身打造的推特終極武器。",
            "subtitle2": "突破官方限制，重塑純淨專注視野。",
            "tags": ["4K 60FPS 極速下載", "100% 廣告粉碎", "1400px 巨幕置中"]
        },
        "small": {
            "headline": "4K 影片下載 & 廣告粉碎",
            "subtitle": "一鍵保存原畫 · 徹底清除推廣 · 動態置中",
            "tags": ["4K MP4", "廣告封鎖", "動態置中"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "en-US": {
        "s1": {
            "category": "SMART MEDIA SNIFFER",
            "headline": "1-CLICK 4K VIDEO\n& RAW PHOTO EXPORT",
            "subtitle": "Automatically detects video streams and original photos. Seamlessly embeds a direct download button right inside the tweet action bar.",
            "bullets": [
                "Native tweet action button, zero link copying",
                "Supports up to 4K 60FPS MP4 & lossless PNG",
                "Direct stream connection with maximum speed"
            ],
            "actionBadge": "DIRECT DOWNLOAD ON TWEET FEED",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "Starship Flight 5 booster catch was pure engineering magic! Making life multiplanetary.",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "Exporting 4K MP4 (3840x2160) · 48.2 MB/s",
            "tooltip": "Download 4K Video"
        },
        "s2": {
            "category": "RESOLUTION SELECTOR & BATCH",
            "headline": "MULTI-RESOLUTION SNIFFER\n& BATCH DOWNLOAD",
            "subtitle": "Inspect all available stream qualities in one unified popup. Choose 4K, 1080p, extract audio, or batch export entire albums as a single ZIP.",
            "bullets": [
                "4K 2160p / 1080p multi-bitrate direct links",
                "1-click studio MP3 extraction & raw photo save",
                "One-click batch ZIP download for multi-photo threads"
            ],
            "actionBadge": "SELECT ANY QUALITY · 1-CLICK BATCH",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "Great team victory tonight! The hard work never stops. Thanks to fans worldwide! #CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 STREAMS READY",
            "batchBtn": "Batch Download All Media (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "4K RAW", "Download", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "1080p", "Download", False),
                ("[PNG] 4096×2730", "Lossless Photo · 12.8 MB", "RAW Image", "Download", False),
                ("[MP3] Audio Stream", "320 kbps · 4.8 MB", "Pure MP3", "Extract", False),
            ]
        },
        "s3": {
            "category": "AST AD-SHIELD ENGINE",
            "headline": "SHATTER PROMOTED ADS\nRESTORE PURE TIMELINE",
            "subtitle": "Removes ancestor DOM nodes in milliseconds to completely obliterate commercial ads and spam promotions. 0% layout shift, 0% latency.",
            "bullets": [
                "Deep AST node detection blocks 100% promoted posts",
                "Eliminates both in-feed ads and sidebar clutter",
                "Zero performance impact, real-time instant purge"
            ],
            "actionBadge": "100% CLEAN AD-FREE TIMELINE",
            "hudTitle": "AST AD-SHIELD: Sponsored Ad Shattered in 1ms",
            "hudFeature": "Pattern: cell.placementTracking.promoted_tweet [100% PURGED]",
            "hudDesc": "Mechanism: Precise ancestor DOM removal without layout shifts",
            "hudPill1": "AST Probe: ACTIVE",
            "hudPill2": "Residual Ads: 0%",
            "hudPill3": "CPU Latency: 0.01ms",
            "hudBtn": "100% Clean Ad-Free Timeline Ready"
        },
        "s4": {
            "category": "DYNAMIC LAYOUT REVOLUTION",
            "headline": "DYNAMIC CENTERING\nPURGE UGLY SIDEBARS",
            "subtitle": "Escape the cramped 600px prison. Purge swollen left and right sidebars, expand your reading feed to center stage.",
            "bullets": [
                "Stepless timeline slider from 600px up to 1400px",
                "One-click purge for both left and right sidebars",
                "Optimized for 4K displays and ultrawide monitors"
            ],
            "actionBadge": "ULTRAWIDE FOCUS READING SANCTUARY",
            "sliderLabel": "Current Width: 1050px (Widescreen Focus)",
            "presets": ["600px Default", "850px Balanced", "1050px Wide [Current]", "1400px Ultra"],
            "tweetText": "From ISS: Earth city lights and atmospheric glow. Crisp ultrawide presentation."
        },
        "s5": {
            "category": "REAL-TIME NOISE RADAR",
            "headline": "KEYWORD VAPORIZER\nCUT SPOILERS & NOISE",
            "subtitle": "Define custom mute rules and keyword filters. Automatically vaporize spoilers, crypto spam, and repetitive drama in milliseconds.",
            "bullets": [
                "Custom rules for keywords, hashtags, and bot accounts",
                "Sub-millisecond filtering with zero blank flashes",
                "High signal-to-noise timeline focused on real value"
            ],
            "actionBadge": "HIGH SIGNAL-TO-NOISE READING",
            "radarStatus": "18 noisy tweets silently vaporized by radar",
            "radarRatio": "Signal/Noise: +350%",
            "muteNotice": "[RADAR VAPORIZED] Tweet matching #airdrop was automatically removed",
            "muteSub": "Removed cleanly from timeline without screen flash"
        },
        "marquee": {
            "category": "ALL-IN-ONE X & THREADS SUPER SUITE",
            "headline": "4K Video Download · Ad-Shield · Dynamic Center",
            "subtitle1": "The ultimate powerhouse built for creators, power users, and avid readers.",
            "subtitle2": "Break stock restrictions and reclaim your focused reading sanctuary.",
            "tags": ["4K 60FPS DOWNLOAD", "100% AD SHATTER", "1400px CENTER FEED"]
        },
        "small": {
            "headline": "4K Video Downloader & Ad-Shield",
            "subtitle": "1-Click Raw Media · Zero Ads · Dynamic Center",
            "tags": ["4K MP4", "Ad-Shield", "Dynamic Center"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "ja": {
        "s1": {
            "category": "スマートメディア検出",
            "headline": "4K 動画＆高画質画像\nワンクリック高速保存",
            "subtitle": "ツイート内の動画や高解像度画像を自動検出。投稿操作バーに直接ダウンロードボタンを埋め込み、最高画質を瞬時に保存。",
            "bullets": [
                "ツイート操作バーに直接配置、URL コピー不要",
                "最高 4K 60FPS 動画＆無劣化原図に対応",
                "ストリーム直結で待機時間なしの高速保存"
            ],
            "actionBadge": "タイムライン上で直接ワンクリック保存",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "スターシップ第5回飛行試験、箸アームでのブースター捕獲に成功！宇宙移住への夢が現実へ。",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "4K MP4 (3840x2160) を高速保存中 · 48.2 MB/s",
            "tooltip": "4K 超高画質動画を保存"
        },
        "s2": {
            "category": "解像度選択＆一括保存",
            "headline": "選べる複数解像度\n4K 出力＆アルバム一括保存",
            "subtitle": "ワンクリックで利用可能な全ストリームを検出。4K、1080p の画質選択や、音声抽出、複数メディアの ZIP 一括保存に対応。",
            "bullets": [
                "4K 2160p / 1080p の無劣化ダイレクトリンク",
                "MP3 音声抽出＆オリジナル解像度フォト保存",
                "複数メディア投稿を一括 ZIP パッケージ保存"
            ],
            "actionBadge": "全解像度対応 · 一括 ZIP 保存",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "今夜のチーム勝利！努力は決して裏切らない。世界中のファンに感謝！ #CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 STREAMS READY",
            "batchBtn": "すべてのメディアを一括保存 (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "最高画質", "保存する", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "フルHD", "保存する", False),
                ("[PNG] 4096×2730", "無劣化オリジナル写真 · 12.8 MB", "RAW画像", "保存する", False),
                ("[MP3] 音声ストリーム", "320 kbps · 4.8 MB", "音声抽出", "抽出する", False),
            ]
        },
        "s3": {
            "category": "AST 広告粉砕エンジン",
            "headline": "広告ツイートをミリ秒抹消\n純粋なタイムラインへ",
            "subtitle": "AST 構文解析により広告ノードを根こそぎ瞬時に消去。スポンサー投稿や詐欺プロモーションをゼロ表示に。",
            "bullets": [
                "深層 AST 検出でプロモーションを 100% 遮断",
                "タイムライン広告＆右側トレンド枠を完全消去",
                "動作遅延ゼロ、ミリ秒単位で即座に反映"
            ],
            "actionBadge": "100% 広告ゼロのクリーンタイムライン",
            "hudTitle": "AST AD-SHIELD: スポンサー広告をミリ秒で粉砕",
            "hudFeature": "検出特徴: cell.placementTracking.promoted_tweet [100% 抹消]",
            "hudDesc": "処理機構: 祖先 DOM ノードを瞬時に切除、画面のちらつきゼロ",
            "hudPill1": "AST プローブ: ACTIVE",
            "hudPill2": "広告残留: 0%",
            "hudPill3": "処理遅延: 0.01ms",
            "hudBtn": "広告ゼロの純粋タイムラインが稼働中"
        },
        "s4": {
            "category": "ダイナミックレイアウト",
            "headline": "中央配置＆大画面化\n不要な左右バーを消去",
            "subtitle": "幅 600px の窮屈な制限を打破。左右の邪魔なサイドバーを消去し、タイムラインを画面中央に美しく拡大。",
            "bullets": [
                "600px〜1400px まで無段階でタイムライン幅を調節",
                "ワンクリックで左右の煩雑なサイドバーを完全非表示",
                "4K ディスプレイ＆ウルトラワイド画面に最適化"
            ],
            "actionBadge": "大画面没入型リーディングモード",
            "sliderLabel": "現在の幅: 1050px (巨幕フォーカスモード)",
            "presets": ["600px 初期値", "850px 快適", "1050px 巨幕 [現在]", "1400px 超広角"],
            "tweetText": "宇宙ステーションから望む地球の夜景と大気の輝き。大画面で鮮明に表示。"
        },
        "s5": {
            "category": "リアルタイムノイズフィルター",
            "headline": "キーワード粉砕レーダー\nネタバレ・スパムを遮断",
            "subtitle": "カスタム単語やハッシュタグを設定し、ネタバレや暗号資産スパム、煽りツイートをミリ秒で自動消去。",
            "bullets": [
                "キーワード、タグ、アカウントの柔軟なミュート",
                "ちらつきなしの高速リアルタイムフィルタリング",
                "高 S/N 比の快適なタイムラインで価値ある情報に集中"
            ],
            "actionBadge": "ノイズゼロの高密度タイムライン",
            "radarStatus": "18 件のスパム・ノイズをレーダーが静脈抹消",
            "radarRatio": "S/N 比向上 +350%",
            "muteNotice": "[RADAR VAPORIZED] #エアドロ に合致するツイートを自動除去",
            "muteSub": "視覚的ノイズをゼロにし、快適な閲覧環境を維持"
        },
        "marquee": {
            "category": "ALL-IN-ONE X & THREADS SUPER SUITE",
            "headline": "4K 動画保存 · 広告粉砕 · 中央大画面",
            "subtitle1": "クリエイターと読書愛好家のための X 拡張機能。",
            "subtitle2": "公式の制限を超え、快適な閲覧空間を創造。",
            "tags": ["4K 60FPS 高速保存", "100% 広告粉砕", "1400px 巨幕配置"]
        },
        "small": {
            "headline": "4K 動画保存 ＆ 広告遮断",
            "subtitle": "ワンクリック保存 · 広告完全排除 · 中央大画面",
            "tags": ["4K MP4", "広告遮断", "ダイナミック配置"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "ko": {
        "s1": {
            "category": "스마트 미디어 감지",
            "headline": "4K 비디오 & 원본 사진\n원클릭 초고속 다운로드",
            "subtitle": "트윗 내 영상과 고화질 원본 사진을 스마트하게 감지하여, 트윗 작업 표시줄에서 바로 다운로드할 수 있습니다.",
            "bullets": [
                "트윗 본문 내 버튼 내장, 링크 복사 불필요",
                "최대 4K 60FPS 비디오 및 무손실 원본 사진 지원",
                "스트림 직접 연결로 지연 없는 초고속 저장"
            ],
            "actionBadge": "피드에서 직접 원클릭 다운로드",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "스타십 5차 시험 비행 로켓 캐치 성공! 다행성 생명체를 향한 꿈이 현실이 되고 있습니다.",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "4K MP4 (3840x2160) 고속 다운로드 중 · 48.2 MB/s",
            "tooltip": "4K 초고화질 비디오 다운로드"
        },
        "s2": {
            "category": "해상도 선택 & 일괄 다운로드",
            "headline": "다양한 해상도 자유 선택\n4K 추출 & 앨범 일괄 저장",
            "subtitle": "트윗 내 모든 미디어 스트림을 한눈에 확인하세요. 4K, 1080p 해상도 선택, 고음질 오디오 추출 및 전체 앨범 ZIP 일괄 저장을 지원합니다.",
            "bullets": [
                "4K 2160p / 1080p 무손실 직접 다운로드",
                "MP3 고음질 오디오 추출 및 원본 사진 저장",
                "다중 미디어 트윗 전체 원클릭 ZIP 일괄 저장"
            ],
            "actionBadge": "해상도 자유 선택 · 일괄 다운로드",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "오늘 밤 환상적인 팀의 승리! 노력은 멈추지 않습니다. 전 세계 팬들에게 감사드립니다! #CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 STREAMS READY",
            "batchBtn": "모든 미디어 파일 일괄 다운로드 (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "최고 화질", "다운로드", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "풀 HD", "파일 저장", False),
                ("[PNG] 4096×2730", "무손실 원본 사진 · 12.8 MB", "RAW 사진", "파일 저장", False),
                ("[MP3] 순수 오디오", "320 kbps · 4.8 MB", "오디오 추출", "추출하기", False),
            ]
        },
        "s3": {
            "category": "AST 광고 분쇄 엔진",
            "headline": "밀리초 단위 광고 제거\n순수한 타임라인 복원",
            "subtitle": "AST 노드 감지로 상업용 광고와 스팸 프로모션을 흔적 없이 완전히 제거합니다. 0% 레이아웃 흔들림, 제로 지연.",
            "bullets": [
                "정밀 AST 노드 감지로 100% 프로모션 차단",
                "피드 광고 및 오른쪽 불필요한 추천 영역 제거",
                "성능 저하 없는 밀리초 단위 실시간 적용"
            ],
            "actionBadge": "100% 광고 없는 청정 타임라인",
            "hudTitle": "AST AD-SHIELD: 스폰서 광고가 밀리초 만에 분쇄됨",
            "hudFeature": "차단 시그니처: cell.placementTracking.promoted_tweet [100% 박멸]",
            "hudDesc": "처리 메커니즘: 조상 DOM 노드 즉각 절제로 레이아웃 흔들림 제로",
            "hudPill1": "AST 프로브: ACTIVE",
            "hudPill2": "잔여 광고: 0%",
            "hudPill3": "CPU 지연: 0.01ms",
            "hudBtn": "광고 없는 100% 클린 피드 준비 완료"
        },
        "s4": {
            "category": "다이내믹 레이아웃 혁신",
            "headline": "중앙 정렬 대화면 모드\n좌우 불필요한 사이드바 제거",
            "subtitle": "답답한 600px 제한에서 벗어나세요. 좌우 잡다한 사이드바를 정리하고 피드를 화면 중앙으로 시원하게 확장합니다.",
            "bullets": [
                "600px ~ 1400px 무단계 타임라인 너비 조절",
                "원클릭으로 좌우 사이드바 완벽 정리",
                "4K 모니터 및 울트라와이드 디스플레이 최적화"
            ],
            "actionBadge": "몰입형 와이드스크린 독서 모드",
            "sliderLabel": "현재 너비: 1050px (대화면 몰입 모드)",
            "presets": ["600px 기본", "850px 편안", "1050px 대화면 [현재]", "1400px 울트라"],
            "tweetText": "우주정거장에서 바라본 지구의 아름다운 야경과 지평선. 와이드스크린으로 감상하세요."
        },
        "s5": {
            "category": "실시간 노이즈 필터 레이더",
            "headline": "키워드 분쇄 레이더\n스포일러와 피로감 차단",
            "subtitle": "민감한 단어와 스포일러 규칙을 등록하면 시끄러운 가십과 스팸 트윗을 밀리초 단위로 자동 분쇄합니다.",
            "bullets": [
                "키워드, 해시태그 및 계정 맞춤형 차단 규칙",
                "깜빡임 없는 초고속 실시간 필터링",
                "높은 신호 대 잡음비로 가치 있는 정보에만 집중"
            ],
            "actionBadge": "잡음 없는 고순도 타임라인",
            "radarStatus": "18개의 유해 스팸 트윗이 레이더에 의해 무소음 분쇄됨",
            "radarRatio": "신호 대 잡음비 향상 +350%",
            "muteNotice": "[RADAR VAPORIZED] #에어드랍 규칙과 일치하는 트윗 자동 제거됨",
            "muteSub": "시각적 방해 없이 타임라인에서 깔끔하게 정리됨"
        },
        "marquee": {
            "category": "ALL-IN-ONE X & THREADS SUPER SUITE",
            "headline": "4K 비디오 다운로드 · 광고 차단 · 중앙 대화면",
            "subtitle1": "크리에이터와 독서가를 위한 궁극의 X 도구.",
            "subtitle2": "공식 제한을 넘어 나만의 몰입형 피드를 경험하세요.",
            "tags": ["4K 60FPS 다운로드", "100% 광고 차단", "1400px 중앙 대화면"]
        },
        "small": {
            "headline": "4K 비디오 다운로더 & 광고 차단",
            "subtitle": "원클릭 미디어 저장 · 광고 완전 제거 · 중앙 정렬",
            "tags": ["4K MP4", "광고 차단", "중앙 정렬"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "es": {
        "s1": {
            "category": "DETECCIÓN INTELIGENTE DE MEDIOS",
            "headline": "DESCARGA VIDEOS 4K\nY FOTOS EN 1 CLIC",
            "subtitle": "Detecta transmisiones de video y fotos en alta resolución. Añade un botón de descarga directa en la barra de acciones del tweet.",
            "bullets": [
                "Botón integrado nativo sin copiar enlaces",
                "Soporta hasta 4K 60FPS MP4 y PNG sin pérdidas",
                "Conexión directa al flujo multimedia a máxima velocidad"
            ],
            "actionBadge": "DESCARGA DIRECTA EN EL FEED",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "¡El atrapamiento del cohete Starship con los palillos fue pura magia de ingeniería!",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "Descargando 4K MP4 (3840x2160) · 48.2 MB/s",
            "tooltip": "Descargar Video 4K"
        },
        "s2": {
            "category": "SELECTOR DE RESOLUCIÓN Y DESCARGA",
            "headline": "MÚLTIPLES RESOLUCIONES\nY DESCARGA MASIVA",
            "subtitle": "Inspecciona todas las calidades disponibles en un solo popup. Selecciona 4K, 1080p, extrae audio o descarga álbumes completos en un archivo ZIP.",
            "bullets": [
                "Enlaces directos sin pérdidas en 4K 2160p y 1080p",
                "Extracción de audio MP3 en 1 clic y fotos originales",
                "Descarga masiva en ZIP para hilos con múltiples fotos"
            ],
            "actionBadge": "SELECCIONA RESOLUCIÓN · DESCARGA MASIVA",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "¡Gran victoria del equipo esta noche! El trabajo duro nunca se detiene. ¡Gracias afición! #CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 FLUIDOS LISTOS",
            "batchBtn": "Descargar todos los medios (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "Máxima calidad", "Descargar", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "Full HD", "Exportar", False),
                ("[PNG] 4096×2730", "Foto sin pérdidas · 12.8 MB", "Foto RAW", "Exportar", False),
                ("[MP3] Audio puro", "320 kbps · 4.8 MB", "Extraer audio", "Exportar", False),
            ]
        },
        "s3": {
            "category": "MOTOR AST CONTRA LA PUBLICIDAD",
            "headline": "ELIMINA PUBLICIDAD\nTIMELINE 100% LIMPIO",
            "subtitle": "Elimina los nodos DOM ancestro en milisegundos para erradicar publicaciones patrocinadas y spam publicitario. Cero saltos de diseño.",
            "bullets": [
                "Detección AST profunda: bloquea 100% tweets promocionados",
                "Elimina publicidad en el feed y barras laterales saturadas",
                "Cero impacto en rendimiento con purga instantánea"
            ],
            "actionBadge": "100% TIMELINE LIMPIO SIN ANUNCIOS",
            "hudTitle": "AST AD-SHIELD: Publicidad patrocinada eliminada",
            "hudFeature": "Patrón: cell.placementTracking.promoted_tweet [100% PURGADO]",
            "hudDesc": "Mecanismo: Eliminación precisa del nodo DOM ancestro sin parpadeo",
            "hudPill1": "Sonda AST: ACTIVA",
            "hudPill2": "Anuncios: 0% RESTANTE",
            "hudPill3": "Latencia: 0.01ms",
            "hudBtn": "Timeline 100% libre de anuncios activo"
        },
        "s4": {
            "category": "REVOLUCIÓN DE DISEÑO DINÁMICO",
            "headline": "CENTRADO DINÁMICO\nELIMINA BARRAS LATERALES",
            "subtitle": "Sal del estrecho límite de 600px. Elimina las barras laterales saturadas y expande tu feed de lectura al centro de la pantalla.",
            "bullets": [
                "Control continuo del ancho de 600px hasta 1400px",
                "Oculta barras laterales izquierda y derecha en un clic",
                "Optimizado para monitores 4K y pantallas ultraanchas"
            ],
            "actionBadge": "LECTURA INMERSIVA PANTALLA ANCHA",
            "sliderLabel": "Ancho actual: 1050px (Modo Enfoque)",
            "presets": ["600px Estándar", "850px Cómodo", "1050px Enfoque [Actual]", "1400px Ultraancho"],
            "tweetText": "Vista desde la EEI: Luces de la Tierra y brillo atmosférico. Presentación panorámica."
        },
        "s5": {
            "category": "RADAR DE RUIDO EN TIEMPO REAL",
            "headline": "RADAR DE PALABRAS CLAVE\nELIMINA SPOILERS Y RUIDO",
            "subtitle": "Configura filtros de palabras clave y silenciamiento personalizado. Vaporiza spoilers, spam de criptomonedas y discusiones tóxicas.",
            "bullets": [
                "Reglas para palabras clave, etiquetas y cuentas bot",
                "Filtrado instantáneo en milisegundos sin parpadeo blanco",
                "Máxima relación señal/ruido para enfocarte en contenido de valor"
            ],
            "actionBadge": "TIMELINE DE ALTA CALIDAD Y VALOR",
            "radarStatus": "18 tweets ruidosos eliminados silenciosamente por el radar",
            "radarRatio": "Señal / Ruido: +350%",
            "muteNotice": "[RADAR VAPORIZADO] Tweet coincidente con #airdrop eliminado",
            "muteSub": "Removido del timeline sin dejar rastro para lectura limpia"
        },
        "marquee": {
            "category": "SUITE PROFESIONAL PARA X Y THREADS",
            "headline": "Descarga 4K · Sin Anuncios · Centrado Dinámico",
            "subtitle1": "La herramienta definitiva para creadores, profesionales y lectores.",
            "subtitle2": "Supera las restricciones oficiales y transforma tu experiencia.",
            "tags": ["DESCARGA 4K 60FPS", "100% SIN ANUNCIOS", "FEED CENTRADO 1400px"]
        },
        "small": {
            "headline": "Descargador 4K & Sin Anuncios",
            "subtitle": "1 Clic Medios RAW · Cero Publicidad · Centrado",
            "tags": ["4K MP4", "Sin Anuncios", "Centrado Dinámico"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "fr": {
        "s1": {
            "category": "DÉTECTEUR INTELLIGENT DE MÉDIAS",
            "headline": "TÉLÉCHARGEMENT VIDÉO 4K\nET PHOTOS EN 1 CLIC",
            "subtitle": "Détecte automatiquement les flux vidéo et les photos haute résolution. Intègre un bouton de téléchargement direct dans la barre du tweet.",
            "bullets": [
                "Bouton natif intégré, aucun copier-coller de lien",
                "Supporte jusqu'au 4K 60FPS MP4 et PNG sans perte",
                "Connexion directe au flux haute vitesse sans attente"
            ],
            "actionBadge": "TÉLÉCHARGEMENT DIRECT DANS LE FLUX",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "L'atterrissage du booster Starship avec les bras mécaniques était magique !",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "Exportation 4K MP4 (3840x2160) · 48.2 MB/s",
            "tooltip": "Télécharger Vidéo 4K"
        },
        "s2": {
            "category": "SÉLECTEUR DE RÉSOLUTION & EXPORT",
            "headline": "CHOIX DE RÉSOLUTIONS\nET TÉLÉCHARGEMENT GROUPÉ",
            "subtitle": "Visualisez toutes les qualités de flux disponibles. Choisissez 4K, 1080p, extrayez l'audio MP3 ou téléchargez des albums complets en ZIP.",
            "bullets": [
                "Liens directs 4K 2160p et 1080p sans perte",
                "Extraction audio MP3 et photos originales en 1 clic",
                "Téléchargement groupé ZIP pour threads multi-médias"
            ],
            "actionBadge": "TOUTES RÉSOLUTIONS · EXPORT GROUPÉ",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "Belle victoire d'équipe ce soir ! Le travail acharné continue. Merci aux fans ! #CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 FLUX DÉTECTÉS",
            "batchBtn": "Télécharger tous les médias (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "Qualité Max", "Télécharger", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "Full HD", "Exporter", False),
                ("[PNG] 4096×2730", "Photo sans perte · 12.8 MB", "Photo RAW", "Exporter", False),
                ("[MP3] Audio pur", "320 kbps · 4.8 MB", "Extraire audio", "Exporter", False),
            ]
        },
        "s3": {
            "category": "MOTEUR ANTI-PUBLICITÉ AST",
            "headline": "PULVÉRISEZ LA PUB\nFIL D'ACTUALITÉ ÉPURÉ",
            "subtitle": "Supprime instantanément les nœuds DOM parents pour éradiquer les tweets sponsorisés et publicités frauduleuses. Zéro décalage.",
            "bullets": [
                "Détection AST profonde bloquant 100% des publicités",
                "Élimine les pubs du flux et les barres latérales encombrées",
                "Zéro impact sur les performances, blocage instantané"
            ],
            "actionBadge": "FIL 100% ÉPURÉ SANS PUBLICITÉ",
            "hudTitle": "AST AD-SHIELD: Publicité sponsorisée supprimée",
            "hudFeature": "Signature: cell.placementTracking.promoted_tweet [100% ÉPURÉ]",
            "hudDesc": "Mécanisme: Suppression précise du nœud DOM sans aucun scintillement",
            "hudPill1": "Sonde AST: ACTIVE",
            "hudPill2": "Pubs résiduelles: 0%",
            "hudPill3": "Latence CPU: 0.01ms",
            "hudBtn": "Fil 100% purifié prêt à l'emploi"
        },
        "s4": {
            "category": "MISE EN PAGE DYNAMIQUE",
            "headline": "CENTRAGE DYNAMIQUE\nSUPPRIMEZ LES VOLETS",
            "subtitle": "Libérez-vous de la prison étroite de 600px. Supprimez les barres latérales encombrées et recentrez votre flux de lecture.",
            "bullets": [
                "Curseur de largeur fluide de 600px à 1400px",
                "Masquage en 1 clic des barres latérales encombrées",
                "Parfaitement adapté aux écrans 4K et ultra-larges"
            ],
            "actionBadge": "MODE LECTURE IMMERSIVE GRAND ÉCRAN",
            "sliderLabel": "Largeur actuelle: 1050px (Mode Focus)",
            "presets": ["600px Défaut", "850px Confort", "1050px Focus [Actuel]", "1400px Ultra-large"],
            "tweetText": "Vue depuis l'ISS: Lumières terrestres et lueur atmosphérique. Affichage panoramique."
        },
        "s5": {
            "category": "RADAR ANTI-BRUIT EN TEMPS RÉEL",
            "headline": "RADAR DE MOTS-CLÉS\nBLOQUEZ SPOILERS ET BRUIT",
            "subtitle": "Définissez vos règles personnalisées. Pulvérisez les spoilers, le spam crypto et les polémiques inutiles en quelques millisecondes.",
            "bullets": [
                "Règles sur mesure pour mots-clés, hashtags et bots",
                "Filtrage ultra-rapide sans écran blanc ni scintillement",
                "Rapport signal/bruit maximal pour valoriser le contenu"
            ],
            "actionBadge": "FIL D'ACTUALITÉ HAUTE VALEUR",
            "radarStatus": "18 tweets bruyants supprimés en silence par le radar",
            "radarRatio": "Signal / Bruit: +350%",
            "muteNotice": "[RADAR PULVÉRISÉ] Tweet correspondant à #airdrop supprimé",
            "muteSub": "Retiré du fil sans laisser de trace pour une lecture paisible"
        },
        "marquee": {
            "category": "SUITE COMPLÈTE X & THREADS",
            "headline": "Vidéo 4K · Zéro Pub · Centrage Dynamique",
            "subtitle1": "L'outil ultime pour créateurs, geeks et passionnés de lecture.",
            "subtitle2": "Dépassez les limites officielles et retrouvez votre clarté.",
            "tags": ["TÉLÉCHARGEMENT 4K", "100% SANS PUB", "FLUX CENTRÉ 1400px"]
        },
        "small": {
            "headline": "Téléchargeur 4K & Zéro Pub",
            "subtitle": "1 Clic Médias RAW · Zéro Pub · Centré",
            "tags": ["4K MP4", "Zéro Pub", "Centrage"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    },
    "de": {
        "s1": {
            "category": "INTELLIGENTE MEDIENERKENNUNG",
            "headline": "4K-VIDEOS & FOTOS\nMIT 1 KLICK HERUNTERLADEN",
            "subtitle": "Erkennt Videostreams und hochauflösende Fotos automatisch. Bettet einen Download-Button direkt in die Tweet-Aktionsleiste ein.",
            "bullets": [
                "Nativer Tweet-Button, kein Linkkopieren nötig",
                "Unterstützt bis zu 4K 60FPS MP4 & verlustfreies PNG",
                "Direkte Highspeed-Verbindung ohne Wartezeit"
            ],
            "actionBadge": "DIREKT IM TWEET-FEED HERUNTERLADEN",
            "authorName": "Elon Musk",
            "authorHandle": "@elonmusk · 3h",
            "tweetText": "Das Fangen des Starship-Boosters war pure Ingenieurskunst!",
            "qualityTag": "4K 60FPS RAW",
            "toastTitle": "DOWNLOADING 4K RAW STREAM",
            "toastDesc": "Exportiere 4K MP4 (3840x2160) · 48.2 MB/s",
            "tooltip": "4K-Video herunterladen"
        },
        "s2": {
            "category": "AUFLÖSUNGSWAHL & BATCH-DOWNLOAD",
            "headline": "FREIE AUFLÖSUNGSWAHL\n4K & BATCH-DOWNLOAD",
            "subtitle": "Alle verfügbaren Qualitätsstufen auf einen Blick. Wählen Sie 4K, 1080p, extrahieren Sie MP3-Audio oder laden Sie Alben als ZIP herunter.",
            "bullets": [
                "Verlustfreie 4K 2160p & 1080p Direktlinks",
                "1-Klick MP3-Audioextraktion & Originalfotos",
                "Batch-ZIP-Download für Threads mit mehreren Medien"
            ],
            "actionBadge": "ALLE AUFLÖSUNGEN · BATCH-DOWNLOAD",
            "authorName": "Cristiano Ronaldo",
            "authorHandle": "@Cristiano · 4h",
            "tweetText": "Großartiger Teamsieg heute Abend! Die harte Arbeit hört nie auf. Danke an alle Fans! #CR7",
            "modalTitle": "HORD Media Sniffer",
            "modalBadge": "4 STREAMS ERKANNT",
            "batchBtn": "Alle Medien herunterladen (ZIP)",
            "streams": [
                ("[MP4] 4K 2160p", "60 FPS · 148.2 MB", "Beste Qualität", "Download", True),
                ("[MP4] 1080p FHD", "60 FPS · 46.5 MB", "Full HD", "Exportieren", False),
                ("[PNG] 4096×2730", "Verlustfreies Foto · 12.8 MB", "RAW-Foto", "Exportieren", False),
                ("[MP3] Reines Audio", "320 kbps · 4.8 MB", "Audio extrahieren", "Exportieren", False),
            ]
        },
        "s3": {
            "category": "AST-WERBEBLOCKER-ENGINE",
            "headline": "WERBUNG ZERSCHMETTERN\nREINE TIMELINE WIEDERHERSTELLEN",
            "subtitle": "Entfernt DOM-Knoten in Millisekunden, um gesponserte Beiträge und Werbespam vollständig zu eliminieren. 0% Layout-Verschiebung.",
            "bullets": [
                "Tiefe AST-Erkennung blockiert 100% Werbe-Tweets",
                "Beseitigt In-Feed-Werbung & überladene Seitenleisten",
                "Keine Leistungseinbußen, Echtzeit-Bereinigung"
            ],
            "actionBadge": "100% SAUBERE WERBEFREIE TIMELINE",
            "hudTitle": "AST AD-SHIELD: Gesponserte Werbung blitzschnell entfernt",
            "hudFeature": "Signatur: cell.placementTracking.promoted_tweet [100% ENTFERNT]",
            "hudDesc": "Mechanismus: Präzise DOM-Knotenentfernung ohne Flackern",
            "hudPill1": "AST-Sonde: AKTIV",
            "hudPill2": "Restwerbung: 0%",
            "hudPill3": "CPU-Latenz: 0.01ms",
            "hudBtn": "100% werbefreie Timeline aktiv"
        },
        "s4": {
            "category": "DYNAMISCHES LAYOUT",
            "headline": "DYNAMISCH ZENTRIEREN\nSEITENLEISTEN BESEITIGEN",
            "subtitle": "Befreien Sie sich vom engen 600px-Korsett. Entfernen Sie überflüssige Seitenleisten und zentrieren Sie Ihren Lesefluss.",
            "bullets": [
                "Stufenloser Breitenregler von 600px bis 1400px",
                "Seitenleisten mit einem Klick ausblenden",
                "Perfekt optimiert für 4K- & Ultrawide-Monitore"
            ],
            "actionBadge": "IMMERSIVER BREITBILD-LESEMODUS",
            "sliderLabel": "Aktuelle Breite: 1050px (Fokus-Modus)",
            "presets": ["600px Standard", "850px Komfort", "1050px Fokus [Aktuell]", "1400px Ultrawide"],
            "tweetText": "Blick von der ISS: Lichter der Erde und atmosphärisches Leuchten. Breitbildansicht."
        },
        "s5": {
            "category": "ECHTZEIT-RAUSCHFILTER",
            "headline": "SCHLÜSSELWORT-RADAR\nSPOILER & NOISE FILTERN",
            "subtitle": "Definieren Sie eigene Stummschaltungsregeln. Zerschmettern Sie Spoiler, Krypto-Spam und überflüssigen Tratsch in Millisekunden.",
            "bullets": [
                "Eigene Regeln für Keywords, Hashtags & Bot-Accounts",
                "Blitzschnelle Filterung ohne weiße Bildschirmblitze",
                "Maximales Signal-Rausch-Verhältnis für wertvolle Inhalte"
            ],
            "actionBadge": "HOCHWERTIGE RAUSCHFREIE TIMELINE",
            "radarStatus": "18 störende Tweets vom Radar lautlos eliminiert",
            "radarRatio": "Signal / Rauschen: +350%",
            "muteNotice": "[RADAR VAPORISIERT] Tweet mit #airdrop lautlos entfernt",
            "muteSub": "Aus der Timeline entfernt für ablenkungsfreies Lesen"
        },
        "marquee": {
            "category": "ALLES-IN-EINEM SUITE FÜR X & THREADS",
            "headline": "4K-Video-Download · Werbeblocker · Zentrierung",
            "subtitle1": "Das ultimative Werkzeug für Creators, Geeks und Power-User.",
            "subtitle2": "Überwinden Sie offizielle Barrieren für ein sauberes Erlebnis.",
            "tags": ["4K 60FPS DOWNLOAD", "100% WERBEFREI", "1400px ZENTRIERT"]
        },
        "small": {
            "headline": "4K-Downloader & Werbeblocker",
            "subtitle": "1-Klick RAW-Medien · Werbefrei · Zentriert",
            "tags": ["4K MP4", "Werbefrei", "Zentriert"],
            "footer": "CHROME WEB STORE OFFICIAL // FREE INSTALL"
        }
    }
}

# Main Execution Loop
for loc, c in LOCALES_CONFIG.items():
    loc_dir = os.path.join(OUT_DIR, loc)
    os.makedirs(loc_dir, exist_ok=True)
    print(f"Generating assets for {loc}...")

    # 1. Screenshot 1
    render_s1(loc, c['s1'], os.path.join(loc_dir, "01_screenshot_1_video_download_1280x800.png"))
    # 2. Screenshot 2
    render_s2(loc, c['s2'], os.path.join(loc_dir, "02_screenshot_2_multi_resolution_batch_1280x800.png"))
    # 3. Screenshot 3
    render_s3(loc, c['s3'], os.path.join(loc_dir, "03_screenshot_3_ad_shield_1280x800.png"))
    # 4. Screenshot 4
    render_s4(loc, c['s4'], os.path.join(loc_dir, "04_screenshot_4_dynamic_center_1280x800.png"))
    # 5. Screenshot 5
    render_s5(loc, c['s5'], os.path.join(loc_dir, "05_screenshot_5_keyword_radar_1280x800.png"))
    # 6. Marquee Promo
    render_marquee(loc, c['marquee'], os.path.join(loc_dir, "06_marquee_promo_1400x560.png"))
    # 7. Small Promo
    render_small(loc, c['small'], os.path.join(loc_dir, "07_small_promo_440x280.png"))
    # 8. Store Icon
    render_store_icon(os.path.join(loc_dir, "08_store_icon_128x128.png"))

print("All 64 assets generated successfully across 8 locales!")
