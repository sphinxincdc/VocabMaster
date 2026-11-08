import os
import re
import json
from PIL import Image, ImageDraw, ImageFont

with open('locales_config_v2.json', 'r', encoding='utf-8') as f:
    LOCALES = json.load(f)

# Load images
im_icon = Image.open('assets/toolkit/icon128.png').convert('RGBA')
im_elon_avatar = Image.open('assets/toolkit/feed_elon_avatar.jpg').convert('RGBA')
im_elon_starship = Image.open('assets/toolkit/feed_elon_starship.jpg').convert('RGB')
im_cr7_avatar = Image.open('assets/toolkit/feed_cr7_avatar.jpg').convert('RGBA')
im_cr7_hug = Image.open('assets/toolkit/feed_cr7_messi_hug_opt.jpg').convert('RGB')
im_taylor_avatar = Image.open('assets/toolkit/feed_taylor_avatar.jpg').convert('RGBA')
im_nasa_avatar = Image.open('assets/toolkit/feed_nasa_avatar_opt.png').convert('RGBA')
im_nasa_cosmos = Image.open('assets/toolkit/feed_nasa_cosmos.jpg').convert('RGB')
im_ad = Image.open('assets/toolkit/feed_ad_ugly_vpn.jpg').convert('RGB')

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

def fit_font_width(text, locale, max_w, base_size=36, min_size=20, bold=True):
    size = base_size
    while size > min_size:
        f = get_font(locale, size, bold=bold)
        bbox = f.getbbox(text)
        if (bbox[2] - bbox[0]) <= max_w:
            return f, size
        size -= 1
    return get_font(locale, min_size, bold=bold), min_size

def draw_round_rect(draw, box, radius, fill=None, outline=None, width=1):
    width = int(width)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def draw_verified_badge(draw, cx, cy, r=7, color='#1D9BF0'):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    draw.line([cx - r*0.45, cy, cx - r*0.1, cy + r*0.4], fill='#FFFFFF', width=max(1, int(r*0.28)))
    draw.line([cx - r*0.1, cy + r*0.4, cx + r*0.5, cy - r*0.35], fill='#FFFFFF', width=max(1, int(r*0.28)))

def draw_x_logo(draw, cx, cy, size=14, color='#FFFFFF'):
    s = size / 2
    draw.line([cx - s, cy - s, cx + s, cy + s], fill=color, width=2)
    draw.line([cx + s, cy - s, cx - s, cy + s], fill=color, width=2)

def circle_mask(size):
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size, size], fill=255)
    return mask

def draw_header_banner(im, draw, locale, tag, title, subtitle, pills=[]):
    # Top Tag
    f_tag = get_font(locale, 11, bold=True)
    t_bbox = f_tag.getbbox(tag)
    t_w = t_bbox[2] - t_bbox[0]
    tag_x = (1280 - (t_w + 24)) // 2
    draw_round_rect(draw, [tag_x, 24, tag_x + t_w + 24, 46], 11, fill='#0B1F2D', outline='#00BA7C', width=1)
    draw.text((tag_x + 12, 29), tag, font=f_tag, fill='#00BA7C')

    # Main Headline
    f_title, title_sz = fit_font_width(title, locale, 1060, base_size=36, min_size=24, bold=True)
    hl_bbox = f_title.getbbox(title)
    hl_w = hl_bbox[2] - hl_bbox[0]
    draw.text(((1280 - hl_w) // 2, 54), title, font=f_title, fill='#FFFFFF')

    # Subtitle
    f_sub = get_font(locale, 15, bold=False)
    sub_bbox = f_sub.getbbox(subtitle)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((1280 - sub_w) // 2, 100), subtitle, font=f_sub, fill='#94A3B8')

    # Pills
    if pills:
        f_pill = get_font(locale, 12, bold=False)
        total_w = 0
        p_widths = []
        for p in pills:
            pb = f_pill.getbbox(p)
            pw = pb[2] - pb[0] + 20
            p_widths.append(pw)
            total_w += pw + 10
        total_w -= 10
        cur_px = (1280 - total_w) // 2
        for i, p in enumerate(pills):
            pw = p_widths[i]
            draw_round_rect(draw, [cur_px, 128, cur_px + pw, 150], 11, fill='#111827', outline='#1F2937', width=1)
            draw.text((cur_px + 10, 132), p, font=f_pill, fill='#38BDF8')
            cur_px += pw + 10

def draw_window_shell(im, draw, bx, by, bw, bh, url="x.com/home"):
    draw_round_rect(draw, [bx, by, bx + bw, by + bh], 14, fill='#070A0F', outline='#1E293B', width=1)
    draw_round_rect(draw, [bx, by, bx + bw, by + 38], 14, fill='#0D1117', outline='#1E293B', width=1)
    draw.rectangle([bx, by + 24, bx + bw, by + 38], fill='#0D1117')
    draw.line([bx, by + 38, bx + bw, by + 38], fill='#1E293B', width=1)
    
    draw.ellipse([bx + 14, by + 14, bx + 24, by + 24], fill='#EF4444')
    draw.ellipse([bx + 30, by + 14, bx + 40, by + 24], fill='#F59E0B')
    draw.ellipse([bx + 46, by + 14, bx + 56, by + 24], fill='#10B981')
    
    draw_round_rect(draw, [bx + 76, by + 8, bx + bw - 60, by + 30], 11, fill='#070A0F', outline='#1F2937', width=1)
    f_url = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)
    draw.text((bx + 92, by + 12), f"https://{url}", font=f_url, fill='#64748B')
    
    ic = im_icon.resize((18, 18), Image.Resampling.LANCZOS)
    im.paste(ic, (bx + bw - 38, by + 10), ic)

# ----------------- SCREENSHOT 1: OVERVIEW -----------------
def render_s1(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#080C14')
    draw = ImageDraw.Draw(im)
    draw_header_banner(im, draw, locale, data['tag'], data['title'], data['sub'], data['pills'])

    bx, by, bw, bh = 70, 162, 1140, 608
    draw_window_shell(im, draw, bx, by, bw, bh, "x.com/home")

    # Left nav rail (W=180)
    draw.line([bx + 180, by + 38, bx + 180, by + bh], fill='#161F2E', width=1)
    draw_x_logo(draw, bx + 36, by + 60, 20)
    
    nav_map = {
        'zh-CN': ["主页 (Home)", "探索 (Explore)", "通知 (Notifications)", "书签 (Bookmarks)", "Threads 视窗"],
        'zh-TW': ["主頁 (Home)", "探索 (Explore)", "通知 (Notifications)", "書籤 (Bookmarks)", "Threads 視窗"],
        'en-US': ["Home", "Explore", "Notifications", "Bookmarks", "Threads View"],
        'ja': ["ホーム (Home)", "話題を検索", "通知", "ブックマーク", "Threads 表示"],
        'ko': ["홈 (Home)", "탐색 (Explore)", "알림 (Notifications)", "북마크", "Threads 피드"],
        'es': ["Inicio (Home)", "Explorar", "Notificaciones", "Guardados", "Vista Threads"],
        'fr': ["Accueil (Home)", "Explorer", "Notifications", "Signets", "Vue Threads"],
        'de': ["Startseite (Home)", "Erkunden", "Mitteilungen", "Lesezeichen", "Threads-Ansicht"],
    }
    nav_items = nav_map.get(locale, nav_map['en-US'])
    cur_ny = by + 95
    f_nav = get_font(locale, 13, bold=False)
    for i, item in enumerate(nav_items):
        if i == 0:
            draw_round_rect(draw, [bx + 16, cur_ny - 4, bx + 164, cur_ny + 26], 8, fill='#161E2E', outline='#00BA7C', width=1)
            draw.text((bx + 30, cur_ny), item, font=get_font(locale, 13, bold=True), fill='#FFFFFF')
        else:
            draw.text((bx + 30, cur_ny), item, font=f_nav, fill='#71767B')
        cur_ny += 38

    # Bottom status card on left rail
    draw_round_rect(draw, [bx + 16, by + bh - 110, bx + 164, by + bh - 16], 10, fill='#0D1420', outline='#1F2937', width=1)
    draw.ellipse([bx + 28, by + bh - 94, bx + 34, by + bh - 88], fill='#10B981')
    
    st_title = "HORD Active" if locale in ['en-US','es','fr','de'] else "HORD 运行中" if locale=='zh-CN' else "HORD 運行中" if locale=='zh-TW' else "HORD 稼働中" if locale=='ja' else "HORD 가동 중"
    draw.text((bx + 40, by + bh - 98), st_title, font=get_font(locale, 11, bold=True), fill='#10B981')
    draw.text((bx + 28, by + bh - 74), "100% Ad-Free" if locale=='en-US' else "广告已净化 (0残留)" if locale=='zh-CN' else "廣告已淨化" if locale=='zh-TW' else "広告ゼロ (クリーン)" if locale=='ja' else "광고 제거 완료" if locale=='ko' else "Sin Anuncios" if locale=='es' else "100% Sans Pub" if locale=='fr' else "100% Werbefrei", font=get_font(locale, 10, bold=False), fill='#94A3B8')
    draw.text((bx + 28, by + bh - 54), "Widescreen Active" if locale=='en-US' else "宽屏居中模式就绪" if locale=='zh-CN' else "寬螢幕置中就緒" if locale=='zh-TW' else "ワイド中央配置" if locale=='ja' else "와이드 모드 활성" if locale=='ko' else "Pantalla Ancha" if locale=='es' else "Mode Large Prêt" if locale=='fr' else "Widescreen Bereit", font=get_font(locale, 10, bold=False), fill='#94A3B8')
    draw.text((bx + 28, by + bh - 34), "Media Saver Ready" if locale=='en-US' else "媒体极速嗅探就绪" if locale=='zh-CN' else "媒體極速下載就緒" if locale=='zh-TW' else "動画保存レディ" if locale=='ja' else "미디어 저장 준비" if locale=='ko' else "Descarga Lista" if locale=='es' else "Téléchargement Prêt" if locale=='fr' else "Download Bereit", font=get_font(locale, 10, bold=False), fill='#94A3B8')

    # Center Feed (W=620)
    feed_x = bx + 180
    feed_w = 620
    draw.line([feed_x + feed_w, by + 38, feed_x + feed_w, by + bh], fill='#161F2E', width=1)

    tab_fy = "For You" if locale in ['en-US','es','fr','de'] else "为你推荐" if locale=='zh-CN' else "為你推薦" if locale=='zh-TW' else "おすすめ" if locale=='ja' else "추천"
    tab_fol = "Following" if locale in ['en-US','es','fr','de'] else "正在关注" if locale=='zh-CN' else "正在追蹤" if locale=='zh-TW' else "フォロー中" if locale=='ja' else "팔로잉"
    draw.text((feed_x + 40, by + 52), tab_fy, font=get_font(locale, 13, bold=True), fill='#FFFFFF')
    draw.line([feed_x + 40, by + 74, feed_x + 140, by + 74], fill='#00BA7C', width=2)
    draw.text((feed_x + 180, by + 52), tab_fol, font=get_font(locale, 13, bold=False), fill='#71767B')
    draw.line([feed_x, by + 76, feed_x + feed_w, by + 76], fill='#161F2E', width=1)

    # Tweet 1: Taylor Swift
    ty1 = by + 88
    t_mask = circle_mask(38)
    taylor_av = im_taylor_avatar.resize((38, 38), Image.Resampling.LANCZOS)
    im.paste(taylor_av, (feed_x + 20, ty1), t_mask)
    f_t = get_font(locale, 14, bold=True)
    draw.text((feed_x + 68, ty1 + 2), "Taylor Swift", font=f_t, fill='#FFFFFF')
    nw_t = f_t.getbbox("Taylor Swift")[2] - f_t.getbbox("Taylor Swift")[0]
    draw_verified_badge(draw, feed_x + 68 + nw_t + 10, ty1 + 10, 7)
    draw.text((feed_x + 68 + nw_t + 22, ty1 + 2), "@taylorswift13 · 2h", font=get_font(locale, 12, bold=False), fill='#71767B')
    draw.text((feed_x + 68, ty1 + 24), "The Eras Tour film is streaming in 4K lossless! Thank you all for singing with me!", font=get_font(locale, 12, bold=False), fill='#E7E9EA')
    draw.text((feed_x + 68, ty1 + 46), "12.4K · 48.2K · 310K · 24.5M", font=get_font(locale, 11, bold=False), fill='#71767B')
    draw.line([feed_x, ty1 + 68, feed_x + feed_w, ty1 + 68], fill='#161F2E', width=1)

    # Tweet 2: Elon Musk with Rocket Video
    ty2 = ty1 + 78
    e_mask = circle_mask(38)
    elon_av = im_elon_avatar.resize((38, 38), Image.Resampling.LANCZOS)
    im.paste(elon_av, (feed_x + 20, ty2), e_mask)
    f_e = get_font(locale, 14, bold=True)
    draw.text((feed_x + 68, ty2 + 2), "Elon Musk", font=f_e, fill='#FFFFFF')
    nw_e = f_e.getbbox("Elon Musk")[2] - f_e.getbbox("Elon Musk")[0]
    draw_verified_badge(draw, feed_x + 68 + nw_e + 10, ty2 + 10, 7)
    draw.text((feed_x + 68 + nw_e + 22, ty2 + 2), "@elonmusk · 4h", font=get_font(locale, 12, bold=False), fill='#71767B')
    draw.text((feed_x + 68, ty2 + 24), "Starship Flight 5 booster catch was incredible! Life becoming multiplanetary.", font=get_font(locale, 12, bold=False), fill='#E7E9EA')
    
    vid_w, vid_h = 520, 210
    starship_cropped = im_elon_starship.resize((vid_w, vid_h), Image.Resampling.LANCZOS)
    im.paste(starship_cropped, (feed_x + 68, ty2 + 48))
    draw_round_rect(draw, [feed_x + 68, ty2 + 48, feed_x + 68 + vid_w, ty2 + 48 + vid_h], 8, outline='#2D3B4E', width=1)
    
    draw_round_rect(draw, [feed_x + 68 + vid_w - 78, ty2 + 56, feed_x + 68 + vid_w - 10, ty2 + 76], 4, fill='#0B1118CC')
    draw.text((feed_x + 68 + vid_w - 72, ty2 + 59), "4K 60FPS", font=get_font(locale, 10, bold=True), fill='#00BA7C')
    
    draw.ellipse([feed_x + 68 + vid_w//2 - 24, ty2 + 48 + vid_h//2 - 24, feed_x + 68 + vid_w//2 + 24, ty2 + 48 + vid_h//2 + 24], fill='#000000AA', outline='#FFFFFF', width=2)
    draw.polygon([
        (feed_x + 68 + vid_w//2 - 8, ty2 + 48 + vid_h//2 - 12),
        (feed_x + 68 + vid_w//2 - 8, ty2 + 48 + vid_h//2 + 12),
        (feed_x + 68 + vid_w//2 + 12, ty2 + 48 + vid_h//2)
    ], fill='#FFFFFF')

    draw.text((feed_x + 68, ty2 + 48 + vid_h + 10), data.get('metrics', "18.4K · 52.8K · 410K · 32.5M"), font=get_font(locale, 11, bold=False), fill='#71767B')
    
    btn_text = data.get('btn', "保存 4K 视频")
    fb = get_font(locale, 11, bold=True)
    fbb = fb.getbbox(btn_text)
    bw_btn = fbb[2] - fbb[0] + 28
    down_btn_x = feed_x + 68 + vid_w - bw_btn
    draw_round_rect(draw, [down_btn_x, ty2 + 48 + vid_h + 6, down_btn_x + bw_btn, ty2 + 48 + vid_h + 28], 11, fill='#00BA7C', outline=None)
    draw.text((down_btn_x + 14, ty2 + 48 + vid_h + 9), btn_text, font=fb, fill='#070A0F')

    # Right Sidebar
    side_x = feed_x + feed_w + 16
    draw_round_rect(draw, [side_x, by + 50, bx + bw - 16, by + 82], 16, fill='#0D1420', outline='#1E293B', width=1)
    draw.text((side_x + 16, by + 60), "Search X & Threads", font=get_font(locale, 12, bold=False), fill='#71767B')

    draw_round_rect(draw, [side_x, by + 96, bx + bw - 16, by + 280], 12, fill='#0D1420', outline='#1E293B', width=1)
    draw.text((side_x + 16, by + 108), "Trends for you", font=get_font(locale, 13, bold=True), fill='#FFFFFF')
    
    trends = [
        ("#StarshipFlight5", "Aerospace · 245K posts"),
        ("#ErasTourFilm", "Music · 180K posts"),
        ("#Rust2026", "Tech · 54K posts"),
        ("#HORDExtension", "Featured · Productivity")
    ]
    cur_ty = by + 136
    for t_title, t_sub in trends:
        draw.text((side_x + 16, cur_ty), t_title, font=get_font(locale, 12, bold=True), fill='#E7E9EA')
        draw.text((side_x + 16, cur_ty + 16), t_sub, font=get_font(locale, 10, bold=False), fill='#71767B')
        cur_ty += 34

    im.save(out_path, quality=95)

# ----------------- SCREENSHOT 2: MEDIA SAVER -----------------
def render_s2(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#080C14')
    draw = ImageDraw.Draw(im)
    draw_header_banner(im, draw, locale, data['tag'], data['title'], data['sub'], data['pills'])

    bx, by, bw, bh = 110, 162, 1060, 608
    draw_window_shell(im, draw, bx, by, bw, bh, "x.com/elonmusk/status/1845628192847")

    post_x = bx + 50
    post_w = bw - 100
    py = by + 58

    e_mask = circle_mask(44)
    elon_av = im_elon_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(elon_av, (post_x, py), e_mask)
    f_e2 = get_font(locale, 16, bold=True)
    draw.text((post_x + 56, py + 2), "Elon Musk", font=f_e2, fill='#FFFFFF')
    nw_e2 = f_e2.getbbox("Elon Musk")[2] - f_e2.getbbox("Elon Musk")[0]
    draw_verified_badge(draw, post_x + 56 + nw_e2 + 12, py + 12, 8)
    draw.text((post_x + 56 + nw_e2 + 26, py + 4), "@elonmusk · 3h", font=get_font(locale, 13, bold=False), fill='#71767B')
    draw_x_logo(draw, post_x + post_w - 20, py + 12, 16, '#71767B')

    draw.text((post_x, py + 52), "Starship Flight 5 booster catch was incredible! Life becoming multiplanetary.", font=get_font(locale, 15, bold=False), fill='#E7E9EA')

    vid_y = py + 84
    vid_w = post_w
    vid_h = 320
    starship_cropped = im_elon_starship.resize((vid_w, vid_h), Image.Resampling.LANCZOS)
    im.paste(starship_cropped, (post_x, vid_y))
    draw_round_rect(draw, [post_x, vid_y, post_x + vid_w, vid_y + vid_h], 10, outline='#2D3B4E', width=1)

    draw_round_rect(draw, [post_x + vid_w - 88, vid_y + 12, post_x + vid_w - 12, vid_y + 36], 4, fill='#0B1118CC')
    draw.text((post_x + vid_w - 82, vid_y + 16), "4K 60FPS", font=get_font(locale, 11, bold=True), fill='#00BA7C')

    draw.ellipse([post_x + vid_w//2 - 32, vid_y + vid_h//2 - 32, post_x + vid_w//2 + 32, vid_y + vid_h//2 + 32], fill='#000000AA', outline='#FFFFFF', width=2)
    draw.polygon([
        (post_x + vid_w//2 - 10, vid_y + vid_h//2 - 16),
        (post_x + vid_w//2 - 10, vid_y + vid_h//2 + 16),
        (post_x + vid_w//2 + 16, vid_y + vid_h//2)
    ], fill='#FFFFFF')

    bar_y = vid_y + vid_h - 24
    draw.line([post_x + 16, bar_y, post_x + vid_w - 16, bar_y], fill='#475569', width=3)
    draw.line([post_x + 16, bar_y, post_x + 360, bar_y], fill='#00BA7C', width=3)
    draw.ellipse([post_x + 356, bar_y - 4, post_x + 364, bar_y + 4], fill='#FFFFFF')
    draw.text((post_x + 16, bar_y - 20), "0:42 / 2:15", font=get_font(locale, 11, bold=False), fill='#FFFFFF')

    act_y = vid_y + vid_h + 16
    draw.text((post_x, act_y + 4), data.get('metrics', "18.4K · 52.8K · 410K · 32.5M"), font=get_font(locale, 13, bold=False), fill='#71767B')

    # Download Button
    btn_text = data.get('btn', "保存视频 (4K)")
    fb = get_font(locale, 13, bold=True)
    fbb = fb.getbbox(btn_text)
    btn_w = fbb[2] - fbb[0] + 32
    btn_h = 36
    btn_x = post_x + post_w - btn_w
    btn_y = act_y
    draw_round_rect(draw, [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], 18, fill='#00BA7C', outline=None)
    draw.text((btn_x + 16, btn_y + 9), btn_text, font=fb, fill='#070A0F')

    # Quick Download Bubble Popover
    bub_w, bub_h = 280, 130
    bub_x = btn_x - (bub_w - btn_w)
    bub_y = btn_y - bub_h - 14

    draw_round_rect(draw, [bub_x, bub_y, bub_x + bub_w, bub_y + bub_h], 12, fill='#0F172A', outline='#00BA7C', width=1)
    arrow_tip_x = btn_x + btn_w // 2
    draw.polygon([(arrow_tip_x - 8, bub_y + bub_h), (arrow_tip_x + 8, bub_y + bub_h), (arrow_tip_x, bub_y + bub_h + 10)], fill='#0F172A')

    draw.text((bub_x + 16, bub_y + 12), "HORD Media Saver", font=get_font(locale, 12, bold=True), fill='#FFFFFF')
    draw.text((bub_x + bub_w - 75, bub_y + 12), "3 Streams", font=get_font(locale, 11, bold=False), fill='#00BA7C')
    draw.line([bub_x + 12, bub_y + 32, bub_x + bub_w - 12, bub_y + 32], fill='#1E293B', width=1)

    # 4K
    draw_round_rect(draw, [bub_x + 12, bub_y + 38, bub_x + bub_w - 12, bub_y + 64], 6, fill='#16253B', outline='#00BA7C', width=1)
    draw.text((bub_x + 20, bub_y + 44), "4K 2160p · 60fps · 148 MB", font=get_font(locale, 11, bold=True), fill='#FFFFFF')
    draw_round_rect(draw, [bub_x + bub_w - 62, bub_y + 42, bub_x + bub_w - 18, bub_y + 60], 4, fill='#00BA7C')
    draw.text((bub_x + bub_w - 56, bub_y + 45), "Save", font=get_font(locale, 10, bold=True), fill='#070A0F')

    # 1080p
    draw.text((bub_x + 20, bub_y + 74), "1080p FHD · 60fps · 46 MB", font=get_font(locale, 11, bold=False), fill='#CBD5E1')
    draw_round_rect(draw, [bub_x + bub_w - 52, bub_y + 70, bub_x + bub_w - 18, bub_y + 88], 4, fill='#1E293B')
    draw.text((bub_x + bub_w - 42, bub_y + 73), "Save", font=get_font(locale, 10, bold=False), fill='#94A3B8')

    # MP3
    draw.text((bub_x + 20, bub_y + 102), "Audio · 320 kbps (MP3)", font=get_font(locale, 11, bold=False), fill='#CBD5E1')
    draw_round_rect(draw, [bub_x + bub_w - 52, bub_y + 98, bub_x + bub_w - 18, bub_y + 116], 4, fill='#1E293B')
    draw.text((bub_x + bub_w - 42, bub_y + 101), "Extract", font=get_font(locale, 10, bold=False), fill='#94A3B8')

    im.save(out_path, quality=95)

# ----------------- SCREENSHOT 3: BEFORE VS AFTER -----------------
def render_s3(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#080C14')
    draw = ImageDraw.Draw(im)
    draw_header_banner(im, draw, locale, data['tag'], data['title'], data['sub'], data['pills'])

    bx, by, bw, bh = 80, 162, 1120, 608
    draw_window_shell(im, draw, bx, by, bw, bh, "x.com/home")

    split_x = bx + bw // 2

    # Left: Before (Stock X)
    draw.rectangle([bx + 1, by + 39, split_x - 1, by + bh - 1], fill='#070A0F')
    
    draw_round_rect(draw, [bx + 20, by + 48, split_x - 20, by + 76], 6, fill='#1A1115', outline='#7F1D1D', width=1)
    draw.text((bx + 32, by + 54), data.get('beforeTag', "原版 X: 充斥商业推广与打扰阅读"), font=get_font(locale, 12, bold=True), fill='#F87171')

    ly1 = by + 86
    t_mask = circle_mask(34)
    taylor_av = im_taylor_avatar.resize((34, 34), Image.Resampling.LANCZOS)
    im.paste(taylor_av, (bx + 24, ly1), t_mask)
    f_s3t = get_font(locale, 13, bold=True)
    draw.text((bx + 66, ly1 + 2), "Taylor Swift", font=f_s3t, fill='#FFFFFF')
    nw_s3t = f_s3t.getbbox("Taylor Swift")[2] - f_s3t.getbbox("Taylor Swift")[0]
    draw_verified_badge(draw, bx + 66 + nw_s3t + 8, ly1 + 9, 6)
    draw.text((bx + 66 + nw_s3t + 18, ly1 + 2), "@taylorswift13 · 2h", font=get_font(locale, 11, bold=False), fill='#71767B')
    draw.text((bx + 66, ly1 + 22), "The Eras Tour film is streaming in 4K lossless! Love you all!", font=get_font(locale, 11, bold=False), fill='#CBD5E1')
    draw.line([bx + 20, ly1 + 48, split_x - 20, ly1 + 48], fill='#1E293B', width=1)

    # Ugly VPN Promoted Ad
    ad_y = ly1 + 56
    draw_round_rect(draw, [bx + 20, ad_y, split_x - 20, ad_y + 240], 8, fill='#11151F', outline='#F59E0B', width=1)
    
    draw.text((bx + 32, ad_y + 10), "Hyperspeed VPN Pro", font=get_font(locale, 13, bold=True), fill='#FFFFFF')
    draw.text((bx + 175, ad_y + 10), "@hyperspeed_vpn", font=get_font(locale, 11, bold=False), fill='#71767B')
    draw_round_rect(draw, [split_x - 90, ad_y + 8, split_x - 30, ad_y + 26], 4, fill='#78350F')
    draw.text((split_x - 84, ad_y + 11), "Sponsored", font=get_font(locale, 10, bold=False), fill='#FCD34D')

    draw.text((bx + 32, ad_y + 32), "Limited Time Offer: Click to claim bonus access! 100 slots left...", font=get_font(locale, 11, bold=False), fill='#94A3B8')

    ad_img_w = (split_x - 20) - (bx + 32)
    ad_img_h = 130
    ad_cropped = im_ad.resize((ad_img_w, ad_img_h), Image.Resampling.LANCZOS)
    im.paste(ad_cropped, (bx + 32, ad_y + 54))

    draw_round_rect(draw, [bx + 32, ad_y + 194, bx + 130, ad_y + 224], 6, fill='#F59E0B')
    draw.text((bx + 48, ad_y + 200), "Install Now", font=get_font(locale, 12, bold=True), fill='#070A0F')
    draw.text((bx + 145, ad_y + 202), "Tracking: cell.promoted_tweet", font=get_font(locale, 10, bold=False), fill='#EF4444')

    draw.text((bx + 32, ad_y + 252), "Sponsored ads interrupt reading flow", font=get_font(locale, 11, bold=False), fill='#94A3B8')

    # Center Divider
    draw.line([split_x, by + 38, split_x, by + bh], fill='#00BA7C', width=2)
    draw.ellipse([split_x - 16, by + bh//2 - 16, split_x + 16, by + bh//2 + 16], fill='#070A0F', outline='#00BA7C', width=2)
    draw.text((split_x - 9, by + bh//2 - 9), "VS", font=get_font(locale, 12, bold=True), fill='#00BA7C')

    # Right: After (With HORD)
    draw.rectangle([split_x + 1, by + 39, bx + bw - 1, by + bh - 1], fill='#070A0F')
    
    draw_round_rect(draw, [split_x + 20, by + 48, bx + bw - 20, by + 76], 6, fill='#0B1F2D', outline='#00BA7C', width=1)
    draw.text((split_x + 32, by + 54), data.get('afterTag', "开启 HORD: 100% 纯净无广告时间线"), font=get_font(locale, 12, bold=True), fill='#00BA7C')

    ry1 = by + 86
    im.paste(taylor_av, (split_x + 24, ry1), t_mask)
    f_s3tr = get_font(locale, 13, bold=True)
    draw.text((split_x + 66, ry1 + 2), "Taylor Swift", font=f_s3tr, fill='#FFFFFF')
    nw_s3tr = f_s3tr.getbbox("Taylor Swift")[2] - f_s3tr.getbbox("Taylor Swift")[0]
    draw_verified_badge(draw, split_x + 66 + nw_s3tr + 8, ry1 + 9, 6)
    draw.text((split_x + 66 + nw_s3tr + 18, ry1 + 2), "@taylorswift13 · 2h", font=get_font(locale, 11, bold=False), fill='#71767B')
    draw.text((split_x + 66, ry1 + 22), "The Eras Tour film is streaming in 4K lossless! Love you all!", font=get_font(locale, 11, bold=False), fill='#CBD5E1')
    draw.line([split_x + 20, ry1 + 48, bx + bw - 20, ry1 + 48], fill='#1E293B', width=1)

    # ZERO GAP -> Followed directly by CR7
    ry2 = ry1 + 56
    c_mask = circle_mask(34)
    cr7_av = im_cr7_avatar.resize((34, 34), Image.Resampling.LANCZOS)
    im.paste(cr7_av, (split_x + 24, ry2), c_mask)
    f_s3cr = get_font(locale, 13, bold=True)
    draw.text((split_x + 66, ry2 + 2), "Cristiano Ronaldo", font=f_s3cr, fill='#FFFFFF')
    nw_s3cr = f_s3cr.getbbox("Cristiano Ronaldo")[2] - f_s3cr.getbbox("Cristiano Ronaldo")[0]
    draw_verified_badge(draw, split_x + 66 + nw_s3cr + 8, ry2 + 9, 6)
    draw.text((split_x + 66 + nw_s3cr + 18, ry2 + 2), "@Cristiano · 4h", font=get_font(locale, 11, bold=False), fill='#71767B')
    draw.text((split_x + 66, ry2 + 22), "Great team victory tonight! The hard work never stops. Thanks worldwide!", font=get_font(locale, 11, bold=False), fill='#CBD5E1')

    hug_w = (bx + bw - 20) - (split_x + 66)
    hug_h = 190
    hug_cropped = im_cr7_hug.resize((hug_w, hug_h), Image.Resampling.LANCZOS)
    im.paste(hug_cropped, (split_x + 66, ry2 + 46))
    draw_round_rect(draw, [split_x + 66, ry2 + 46, split_x + 66 + hug_w, ry2 + 46 + hug_h], 8, outline='#1E293B', width=1)

    draw_round_rect(draw, [split_x + 20, by + bh - 52, bx + bw - 20, by + bh - 20], 8, fill='#0B1F2D', outline='#00BA7C', width=1)
    draw.text((split_x + 40, by + bh - 42), data.get('bottomPill', "广告无痕移除 · 0% 留白残留 · 纯净贴合"), font=get_font(locale, 12, bold=True), fill='#00BA7C')

    im.save(out_path, quality=95)

# ----------------- SCREENSHOT 4: CUSTOM LAYOUT -----------------
def render_s4(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#080C14')
    draw = ImageDraw.Draw(im)
    draw_header_banner(im, draw, locale, data['tag'], data['title'], data['sub'], data['pills'])

    bx, by, bw, bh = 70, 162, 1140, 608
    draw_window_shell(im, draw, bx, by, bw, bh, "x.com/NASA")

    ctrl_y = by + 50
    draw_round_rect(draw, [bx + 40, ctrl_y, bx + bw - 40, ctrl_y + 44], 10, fill='#0D1420', outline='#1E293B', width=1)
    
    draw.text((bx + 60, ctrl_y + 14), data.get('sliderLabel', "时间线宽度自由调节:"), font=get_font(locale, 12, bold=True), fill='#FFFFFF')
    
    sl_x1 = bx + 220
    sl_x2 = bx + 780
    sl_y = ctrl_y + 22
    draw.line([sl_x1, sl_y, sl_x2, sl_y], fill='#1E293B', width=4)
    sl_thumb_x = int(sl_x1 + (sl_x2 - sl_x1) * 0.65)
    draw.line([sl_x1, sl_y, sl_thumb_x, sl_y], fill='#00BA7C', width=4)
    draw.ellipse([sl_thumb_x - 8, sl_y - 8, sl_thumb_x + 8, sl_y + 8], fill='#FFFFFF', outline='#00BA7C', width=2)
    
    draw.text((sl_x1 - 10, sl_y + 12), "600px", font=get_font(locale, 10, bold=False), fill='#64748B')
    draw.text((int(sl_x1 + (sl_x2 - sl_x1)*0.35) - 10, sl_y + 12), "850px", font=get_font(locale, 10, bold=False), fill='#64748B')
    draw.text((sl_thumb_x - 16, sl_y + 12), "1050px", font=get_font(locale, 10, bold=True), fill='#00BA7C')
    draw.text((sl_x2 - 16, sl_y + 12), "1400px", font=get_font(locale, 10, bold=False), fill='#64748B')

    mode_text = data.get('modePill', "1050px 居中专注模式")
    f_mode = get_font(locale, 11, bold=True)
    fmb = f_mode.getbbox(mode_text)
    mw_pill = fmb[2] - fmb[0] + 24
    draw_round_rect(draw, [bx + bw - mw_pill - 56, ctrl_y + 10, bx + bw - 56, ctrl_y + 34], 12, fill='#0B1F2D', outline='#00BA7C', width=1)
    draw.text((bx + bw - mw_pill - 44, ctrl_y + 14), mode_text, font=f_mode, fill='#00BA7C')

    feed_w = 860
    feed_x = bx + (bw - feed_w) // 2
    fy = ctrl_y + 60

    n_mask = circle_mask(44)
    nasa_av = im_nasa_avatar.resize((44, 44), Image.Resampling.LANCZOS)
    im.paste(nasa_av, (feed_x + 10, fy), n_mask)
    fn_nasa = get_font(locale, 16, bold=True)
    draw.text((feed_x + 64, fy + 2), "NASA Cosmos", font=fn_nasa, fill='#FFFFFF')
    nw_nasa = fn_nasa.getbbox("NASA Cosmos")[2] - fn_nasa.getbbox("NASA Cosmos")[0]
    draw_verified_badge(draw, feed_x + 64 + nw_nasa + 12, fy + 12, 8)
    draw.text((feed_x + 64 + nw_nasa + 26, fy + 4), "@NASA · 5h", font=get_font(locale, 13, bold=False), fill='#71767B')

    draw.text((feed_x + 64, fy + 26), "Earth from orbit at night. A breathtaking panoramic view of city lights and atmospheric glow.", font=get_font(locale, 13, bold=False), fill='#E7E9EA')

    pan_w = feed_w - 20
    pan_h = 280
    cosmos_cropped = im_nasa_cosmos.resize((pan_w, pan_h), Image.Resampling.LANCZOS)
    im.paste(cosmos_cropped, (feed_x + 10, fy + 54))
    draw_round_rect(draw, [feed_x + 10, fy + 54, feed_x + 10 + pan_w, fy + 54 + pan_h], 10, outline='#1E293B', width=1)

    draw_round_rect(draw, [feed_x + pan_w - 150, fy + 66, feed_x + pan_w - 6, fy + 90], 6, fill='#070A0FCC')
    draw.text((feed_x + pan_w - 142, fy + 71), "1050px WIDESCREEN", font=get_font(locale, 10, bold=True), fill='#00BA7C')

    draw.text((feed_x + 10, fy + 54 + pan_h + 12), data.get('metrics', "14.2K · 48.6K · 210K · 18.4M"), font=get_font(locale, 12, bold=False), fill='#71767B')
    draw.text((feed_x + pan_w - 220, fy + 54 + pan_h + 12), data.get('bottomNote', "左右侧栏已自动折叠"), font=get_font(locale, 11, bold=False), fill='#00BA7C')

    im.save(out_path, quality=95)

# ----------------- SCREENSHOT 5: KEYWORD FILTER -----------------
def render_s5(locale, data, out_path):
    im = Image.new('RGB', (1280, 800), '#080C14')
    draw = ImageDraw.Draw(im)
    draw_header_banner(im, draw, locale, data['tag'], data['title'], data['sub'], data['pills'])

    bx, by, bw, bh = 110, 162, 1060, 608
    draw_window_shell(im, draw, bx, by, bw, bh, "x.com/home")

    ry = by + 52
    draw_round_rect(draw, [bx + 40, ry, bx + bw - 40, ry + 104], 12, fill='#0D1420', outline='#1E293B', width=1)
    
    draw_round_rect(draw, [bx + 56, ry + 14, bx + bw - 56, ry + 46], 8, fill='#070A0F', outline='#2D3B4E', width=1)
    draw.text((bx + 70, ry + 22), data.get('placeholder', "Type keywords or hashtags to mute..."), font=get_font(locale, 12, bold=False), fill='#64748B')
    
    btn_add = data.get('addBtn', "+ Add Rule")
    draw_round_rect(draw, [bx + bw - 146, ry + 18, bx + bw - 64, ry + 42], 6, fill='#00BA7C')
    draw.text((bx + bw - 134, ry + 24), btn_add, font=get_font(locale, 11, bold=True), fill='#070A0F')

    draw.text((bx + 56, ry + 64), data.get('rulesLabel', "Active Rules:"), font=get_font(locale, 11, bold=False), fill='#94A3B8')
    rules = data.get('rules', ["✕ #spoilers", "✕ #airdrop", "✕ #giveaway", "✕ #drama"])
    cur_rx = bx + 160
    for r in rules:
        f_r = get_font(locale, 11, bold=False)
        rb = f_r.getbbox(r)
        rw = rb[2] - rb[0] + 18
        draw_round_rect(draw, [cur_rx, ry + 58, cur_rx + rw, ry + 82], 6, fill='#161F2E', outline='#334155', width=1)
        draw.text((cur_rx + 9, ry + 64), r, font=f_r, fill='#E2E8F0')
        cur_rx += rw + 10

    draw.ellipse([bx + bw - 210, ry + 68, bx + bw - 204, ry + 74], fill='#10B981')
    draw.text((bx + bw - 196, ry + 64), data.get('status', "Mute Engine Active"), font=get_font(locale, 11, bold=False), fill='#10B981')

    sy = ry + 120

    # 1. Collapsed Muted Notice Row
    draw_round_rect(draw, [bx + 40, sy, bx + bw - 40, sy + 38], 8, fill='#0F141E', outline='#1E293B', width=1)
    draw.text((bx + 56, sy + 11), data.get('mutedRow', "Auto-collapsed tweet matching rule (click to expand)"), font=get_font(locale, 12, bold=False), fill='#64748B')
    draw.text((bx + bw - 110, sy + 11), "[Expand]", font=get_font(locale, 11, bold=False), fill='#38BDF8')

    # 2. Rust Foundation Tweet
    ty = sy + 54
    draw.ellipse([bx + 40, ty, bx + 84, ty + 44], fill='#070A0F', outline='#00BA7C', width=2)
    draw.text((bx + 51, ty + 12), "RF", font=get_font(locale, 15, bold=True), fill='#00BA7C')

    f_rf = get_font(locale, 16, bold=True)
    draw.text((bx + 96, ty + 2), "Rust Foundation", font=f_rf, fill='#FFFFFF')
    nw_rf = f_rf.getbbox("Rust Foundation")[2] - f_rf.getbbox("Rust Foundation")[0]
    draw_verified_badge(draw, bx + 96 + nw_rf + 10, ty + 12, 8)
    draw.text((bx + 96 + nw_rf + 24, ty + 4), "@rustlang · 1h", font=get_font(locale, 13, bold=False), fill='#71767B')

    draw.text((bx + 96, ty + 30), "Announcing Rust 2026 edition! Zero-cost abstractions, fearless concurrency, and ultra-fast", font=get_font(locale, 14, bold=False), fill='#E7E9EA')
    draw.text((bx + 96, ty + 52), "memory safety without garbage collection. The future of systems engineering is here.", font=get_font(locale, 14, bold=False), fill='#E7E9EA')

    draw_round_rect(draw, [bx + 96, ty + 80, bx + bw - 40, ty + 190], 8, fill='#090E17', outline='#1E293B', width=1)
    f_code = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 12)
    draw.text((bx + 114, ty + 96), "// Rust 2026 Concurrency Benchmark", font=f_code, fill='#64748B')
    draw.text((bx + 114, ty + 120), "fn main() -> Result<(), SystemError> {", font=f_code, fill='#E2E8F0')
    draw.text((bx + 134, ty + 142), "let cluster = AsyncCluster::spawn_parallel(4096)?;", font=f_code, fill='#00BA7C')
    draw.text((bx + 134, ty + 164), "cluster.verify_zero_cost_invariants()", font=f_code, fill='#38BDF8')
    draw.text((bx + 114, ty + 186), "}", font=f_code, fill='#E2E8F0')

    draw.text((bx + 96, ty + 214), data.get('metrics', "1.8K · 6.2K · 45K · 2.8M"), font=get_font(locale, 12, bold=False), fill='#71767B')
    draw.text((bx + bw - 220, ty + 214), data.get('bottomNote', "信噪比大幅提升"), font=get_font(locale, 11, bold=True), fill='#00BA7C')

    im.save(out_path, quality=95)

# ----------------- MARQUEE BANNER (1400x560) -----------------
def render_marquee(locale, data, out_path):
    im = Image.new('RGB', (1400, 560), '#080C14')
    draw = ImageDraw.Draw(im)

    cur_y = 60
    ic = im_icon.resize((36, 36), Image.Resampling.LANCZOS)
    im.paste(ic, (80, cur_y), ic)
    draw.text((126, cur_y + 6), "HORD", font=get_font(locale, 20, bold=True), fill='#FFFFFF')
    draw.text((194, cur_y + 6), "X-Toolkit", font=get_font(locale, 20, bold=True), fill='#00BA7C')

    cur_y += 64
    draw_round_rect(draw, [80, cur_y, 240, cur_y + 26], 13, fill='#0B1F2D', outline='#00BA7C', width=1)
    draw.text((96, cur_y + 5), data.get('tag', "FOR X & THREADS"), font=get_font(locale, 11, bold=True), fill='#00BA7C')

    cur_y += 42
    f_title, _ = fit_font_width(data['title'], locale, 500, base_size=42, min_size=26, bold=True)
    draw.text((80, cur_y), data['title'], font=f_title, fill='#FFFFFF')

    cur_y += 64
    draw.text((80, cur_y), data['sub'], font=get_font(locale, 17, bold=False), fill='#94A3B8')

    cur_y += 56
    pills = data.get('pills', ["Clean Feed", "4K Video Saver", "Widescreen", "Noise Muted"])
    cur_px = 80
    for p in pills:
        f_p = get_font(locale, 12, bold=False)
        pb = f_p.getbbox(p)
        pw = pb[2] - pb[0] + 20
        draw_round_rect(draw, [cur_px, cur_y, cur_px + pw, cur_y + 32], 16, fill='#111827', outline='#1F2937', width=1)
        draw.text((cur_px + 10, cur_y + 8), p, font=f_p, fill='#38BDF8')
        cur_px += pw + 10

    # Right Showcase Window (X: 620 to 1340, W=720, H=440)
    bx, by, bw, bh = 620, 60, 720, 440
    draw_window_shell(im, draw, bx, by, bw, bh, "x.com/home")

    star_w = bw - 40
    star_h = 240
    star_cropped = im_elon_starship.resize((star_w, star_h), Image.Resampling.LANCZOS)
    im.paste(star_cropped, (bx + 20, by + 56))
    draw_round_rect(draw, [bx + 20, by + 56, bx + 20 + star_w, by + 56 + star_h], 8, outline='#1E293B', width=1)

    draw_round_rect(draw, [bx + star_w - 220, by + 56 + star_h - 70, bx + star_w - 10, by + 56 + star_h - 10], 8, fill='#0B1422EE', outline='#00BA7C', width=1)
    draw.text((bx + star_w - 206, by + 56 + star_h - 60), "4K Stream Ready", font=get_font(locale, 11, bold=True), fill='#FFFFFF')
    draw.text((bx + star_w - 206, by + 56 + star_h - 40), "One-Click Instant Save", font=get_font(locale, 10, bold=False), fill='#00BA7C')

    draw.text((bx + 20, by + 56 + star_h + 20), "Elon Musk @elonmusk · Starship Flight 5", font=get_font(locale, 13, bold=True), fill='#FFFFFF')
    draw.text((bx + 20, by + 56 + star_h + 44), "18.4K · 52.8K · 410K · 32.5M", font=get_font(locale, 11, bold=False), fill='#71767B')
    
    btn_text = data.get('btn', "Save 4K Video")
    fb = get_font(locale, 12, bold=True)
    fbb = fb.getbbox(btn_text)
    bw_btn = fbb[2] - fbb[0] + 28
    draw_round_rect(draw, [bx + bw - bw_btn - 20, by + 56 + star_h + 24, bx + bw - 20, by + 56 + star_h + 54], 15, fill='#00BA7C')
    draw.text((bx + bw - bw_btn - 6, by + 56 + star_h + 32), btn_text, font=fb, fill='#070A0F')

    im.save(out_path, quality=95)

# ----------------- SMALL PROMO TILE (440x280) -----------------
def render_small(locale, data, out_path):
    im = Image.new('RGB', (440, 280), '#080C14')
    draw = ImageDraw.Draw(im)

    draw_round_rect(draw, [12, 12, 428, 268], 16, fill='#0B0F19', outline='#1E293B', width=1)

    ic = im_icon.resize((36, 36), Image.Resampling.LANCZOS)
    im.paste(ic, (32, 32), ic)
    draw.text((78, 38), "HORD", font=get_font(locale, 18, bold=True), fill='#FFFFFF')
    draw.text((138, 38), "X-Toolkit", font=get_font(locale, 18, bold=True), fill='#00BA7C')

    f_title, _ = fit_font_width(data['title'], locale, 360, base_size=26, min_size=18, bold=True)
    draw.text((32, 88), data['title'], font=f_title, fill='#FFFFFF')

    draw.text((32, 130), data['sub'], font=get_font(locale, 13, bold=False), fill='#94A3B8')

    pills = data.get('pills', ["Clean Feed", "4K Download"])
    cur_px = 32
    for p in pills:
        f_p = get_font(locale, 12, bold=False)
        pb = f_p.getbbox(p)
        pw = pb[2] - pb[0] + 24
        draw_round_rect(draw, [cur_px, 172, cur_px + pw, 206], 8, fill='#111827', outline='#1F2937', width=1)
        draw.text((cur_px + 12, 182), p, font=f_p, fill='#00BA7C' if '4K' in p else '#38BDF8')
        cur_px += pw + 10

    draw.text((32, 230), "CHROME WEB STORE OFFICIAL", font=get_font(locale, 10, bold=True), fill='#64748B')

    im.save(out_path, quality=95)

# ----------------- STORE ICON (128x128) -----------------
def render_store_icon(out_path):
    im_icon.save(out_path)

# Loop and render all 8 locales
for loc in LOCALES:
    loc_dir = os.path.join('cws_store_assets', loc)
    os.makedirs(loc_dir, exist_ok=True)
    c = LOCALES[loc]
    print(f"Rendering all 8 PNGs for {loc}...")
    render_s1(loc, c['s1'], os.path.join(loc_dir, "01_screenshot_1_overview_1280x800.png"))
    render_s2(loc, c['s2'], os.path.join(loc_dir, "02_screenshot_2_media_saver_1280x800.png"))
    render_s3(loc, c['s3'], os.path.join(loc_dir, "03_screenshot_3_clean_timeline_1280x800.png"))
    render_s4(loc, c['s4'], os.path.join(loc_dir, "04_screenshot_4_custom_layout_1280x800.png"))
    render_s5(loc, c['s5'], os.path.join(loc_dir, "05_screenshot_5_keyword_filter_1280x800.png"))
    render_marquee(loc, c['marquee'], os.path.join(loc_dir, "06_marquee_promo_1400x560.png"))
    render_small(loc, c['small'], os.path.join(loc_dir, "07_small_promo_440x280.png"))
    render_store_icon(os.path.join(loc_dir, "08_store_icon_128x128.png"))

print("=== Successfully rendered all 64 CWS PNGs! ===")
