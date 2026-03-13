import cv2
import numpy as np
import sys
import os

def imread_unicode(path):
    with open(path, "rb") as f:
        img_array = np.asarray(bytearray(f.read()), dtype=np.uint8)
        return cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)

def imwrite_unicode(path, img):
    is_success, im_buf_arr = cv2.imencode(".png", img)
    if is_success:
        im_buf_arr.tofile(path)

def extract_popup(image_path):
    print(f"Processing {image_path}...")
    img = imread_unicode(image_path)
    if img is None:
        print(f"Failed to load {image_path}")
        return
    
    # Determine the output path
    base, ext = os.path.splitext(image_path)
    output_path = base + "_transparent.png"

    # Convert to grayscale for thresholding
    if len(img.shape) == 3 and img.shape[2] == 4:
        gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Assume the corners are the background. Pick the top-left corner color.
    # Use floodFill to find all background pixels connected to the corner.
    mask_ff = np.zeros((gray.shape[0] + 2, gray.shape[1] + 2), np.uint8)
    diff = 10
    cv2.floodFill(gray, mask_ff, (0, 0), 255, diff, diff)
    cv2.floodFill(gray, mask_ff, (gray.shape[1]-1, 0), 255, diff, diff)
    cv2.floodFill(gray, mask_ff, (0, gray.shape[0]-1), 255, diff, diff)
    cv2.floodFill(gray, mask_ff, (gray.shape[1]-1, gray.shape[0]-1), 255, diff, diff)

    bg_mask = mask_ff[1:-1, 1:-1]
    
    # The popup is where bg_mask is 0
    popup_mask = np.zeros_like(gray)
    popup_mask[bg_mask == 0] = 255

    # Find the largest contour
    contours, _ = cv2.findContours(popup_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("No contours found.")
        return
    
    largest_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest_contour)

    # Draw a clean filled contour to act as alpha mask
    clean_alpha = np.zeros_like(gray)
    cv2.drawContours(clean_alpha, [largest_contour], -1, 255, thickness=cv2.FILLED)
    
    # Slight anti-aliasing
    clean_alpha = cv2.GaussianBlur(clean_alpha, (3, 3), 0)

    # Attach the alpha channel
    if len(img.shape) == 3 and img.shape[2] == 3:
        b, g, r = cv2.split(img)
        img_new = cv2.merge((b, g, r, clean_alpha))
    elif len(img.shape) == 3 and img.shape[2] == 4:
        b, g, r, a = cv2.split(img)
        # Combine the original alpha with our new alpha
        img_new = cv2.merge((b, g, r, clean_alpha))
    else:
        img_new = img

    # Crop
    cropped = img_new[y:y+h, x:x+w]

    imwrite_unicode(output_path, cropped)
    print(f"Saved cropped, transparent image to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        extract_popup(sys.argv[1])
