import os
import sys
import shutil

# Make sure standard stdout encoding handles unicode
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Mapping staging filenames to website target path structures
MAPPING = {
    "1_day": ("manange\u5355\u8bcd\u672c", "manange\u5355\u8bcd\u672c\u65e5\u95f41.png"),
    "1_night": ("manange\u5355\u8bcd\u672c", "manange\u5355\u8bcd\u672c\u591c\u95f41.png"),
    "2_day": ("manange\u5355\u8bcd\u672c", "manange\u5355\u8bcd\u672c\u65e5\u95f42.png"),
    "2_night": ("manange\u5355\u8bcd\u672c", "manange\u5355\u8bcd\u672c\u591c\u95f42.png"),
    "3_day": ("content\u5f39\u7a97", "\u65e5\u95f4\u6a21\u5f0f\u7ffb\u8bd1.png"),
    "3_night": ("content\u5f39\u7a97", "\u591c\u95f4\u6a21\u5f0f\u7ffb\u8bd1.png"),
    "4_day": ("content\u5f39\u7a97", "\u65e5\u95f4\u6a21\u5f0f\u5f39\u7a97.png"),
    "4_night": ("content\u5f39\u7a97", "\u591c\u95f4\u7f51\u9175\u622a\u56fe.png"),
    "5": ("content\u5f39\u7a97", "\u65e5\u95f4\u6a21\u5f0f\u5f39\u7a972.png"),
    "6_day": ("popup\u83dc\u5355", "_\u65e5\u95f4\u83dc\u5355\u680f.png"),
    "6_night": ("popup\u83dc\u5355", "\u591c\u95f4\u83dc\u5355\u680f.png"),
    "7_day": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af\u65e5\u95f4\u6a21\u5f0f0.png"),
    "7_night": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af0.png"),
    "8_day": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af\u65e5\u95f4\u6a21\u5f0f2.png"),
    "8_night": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af2.png"),
    "9_day": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af\u65e5\u95f4\u6a21\u5f0f4.png"),
    "9_night": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af4.png"),
    "10_day": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af\u65e5\u95f4\u6a21\u5f0f7.png"),
    "10_night": ("test\u827e\u5bbe\u6d69\u65af", "\u827e\u5bbe\u6d69\u65af7.png"),
    "11": ("YouTube\u4f34\u4fa3", "\u64ad\u653e\u53cc\u8bed\u5b57\u5e55.png"),
    "12_day": ("\u9605\u8bfb\u5668", "3D\u4e66\u67b6.png"),
    "12_night": ("\u9605\u8bfb\u5668", "3D\u4e66\u67b6_\u591c\u95f4.png"),
    "13": ("\u6e38\u620f\u5927\u5385", "Arcade\u5927\u5385.png"),
    "14_day": ("AI\u89e3\u6790", "\u53e5\u5b50\u6df1\u5ea6\u900f\u6790.png"),
    "14_night": ("AI\u89e3\u6790", "\u53e5\u5b50\u6df1\u5ea6\u900f\u6790_\u591c\u95f4.png"),
    "15": ("Hub\u5b66\u4e60\u4e2d\u67a2", "Hub\u9996\u9875.png"),
    "16": ("\u4e91\u7aef\u540c\u6b65", "\u540c\u6b65\u9762\u677f.png")
}

def find_file(directory, base_name):
    # Search for base_name with common image extension
    extensions = [".png", ".jpg", ".jpeg"]
    for ext in extensions:
        test_path = os.path.join(directory, base_name + ext)
        if os.path.exists(test_path):
            return test_path
        test_path_upper = os.path.join(directory, base_name + ext.upper())
        if os.path.exists(test_path_upper):
            return test_path_upper
    return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python organize_screenshots.py <staging_directory>")
        print("Example: python organize_screenshots.py C:\\Users\\frees\\Desktop\\hord_staging")
        sys.exit(1)

    staging_dir = sys.argv[1]
    if not os.path.exists(staging_dir):
        print(f"Error: Staging directory '{staging_dir}' does not exist!")
        sys.exit(1)

    # Determine website project path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_dir = os.path.dirname(script_dir)
    screens_dir = os.path.join(web_dir, "screens")

    # Try importing Pillow for image format optimization (convert all to PNG for extension compatibility)
    try:
        from PIL import Image
        has_pillow = True
        print("Pillow library detected. Images will be optimized and saved as standard formats.")
    except ImportError:
        has_pillow = False
        print("Pillow not installed. Images will be copied directly.")

    success_count = 0
    missing_count = 0

    for key, (sub_dir, target_name) in MAPPING.items():
        src_file = find_file(staging_dir, key)
        if not src_file:
            # Fallback check for case insensitive keys
            src_file = find_file(staging_dir, key.upper())
            if not src_file:
                src_file = find_file(staging_dir, key.lower())

        target_sub_path = os.path.join(screens_dir, sub_dir)
        os.makedirs(target_sub_path, exist_ok=True)
        target_path = os.path.join(target_sub_path, target_name)

        if src_file:
            try:
                # If Pillow is available and source file is not PNG, or if we want to save space/ensure compatibility
                if has_pillow and not src_file.lower().endswith(".png"):
                    with Image.open(src_file) as img:
                        img.save(target_path, "PNG")
                    print(f"Processed & converted: {src_file} -> {target_path}")
                else:
                    shutil.copy2(src_file, target_path)
                    print(f"Copied: {src_file} -> {target_path}")
                success_count += 1
            except Exception as e:
                print(f"Error processing {src_file}: {e}")
        else:
            print(f"Missing staging file for: '{key}' ({sub_dir}/{target_name})")
            missing_count += 1

    print("\n-------------------------------------------")
    print(f"Screenshot sorting complete! Successfully matched: {success_count}, Missing/Skipped: {missing_count}")
    print("-------------------------------------------")

if __name__ == "__main__":
    main()
