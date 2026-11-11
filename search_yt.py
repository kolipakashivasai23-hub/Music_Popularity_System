import urllib.request
import urllib.parse
import re
import json

queries = [
    ('Telugu 1 - Samajavaragamana', 'Samajavaragamana Ala Vaikunthapurramuloo'),
    ('Telugu 1 Alt - Butta Bomma', 'Butta Bomma Ala Vaikunthapurramuloo'),
    ('Telugu 1 Alt - Ramuloo Ramulaa', 'Ramuloo Ramulaa Ala Vaikunthapurramuloo'),
    ('Telugu 2 - Srivalli Telugu', 'Srivalli Pushpa Telugu'),
    ('Telugu 2 Alt - Oo Antava', 'Oo Antava Mawa Pushpa'),
    ('Telugu 2 Alt - Saranga Dariya', 'Saranga Dariya Love Story'),
    ('Telugu 2 Alt - Chuttamalle', 'Chuttamalle Devara Telugu'),
    ('Hindi 1 - Kesariya', 'Kesariya Brahmastra Arijit Singh'),
    ('Hindi 2 - Chaleya', 'Chaleya Jawan Arijit Singh'),
    ('Hindi 2 Alt - Apna Bana Le', 'Apna Bana Le Bhediya Arijit Singh'),
    ('Hindi 2 Alt - Raataan Lambiyan', 'Raataan Lambiyan Shershaah'),
    ('Hindi 2 Alt - Tum Hi Ho', 'Tum Hi Ho Aashiqui 2'),
    ('English 1 - Blinding Lights', 'Blinding Lights The Weeknd')
]

for label, q in queries:
    search_url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(q)}"
    try:
        req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
        unique_ids = list(dict.fromkeys(video_ids))[:5]
        
        working = []
        for vid in unique_ids:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
            try:
                o_req = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
                o_res = urllib.request.urlopen(o_req)
                o_data = json.loads(o_res.read().decode('utf-8'))
                title = o_data.get('title', '')
                working.append((vid, title))
            except Exception as e:
                pass
        
        print(f"=== {label} ===")
        for v, t in working:
            print(f"  ID: {v} | Title: {t}")
    except Exception as e:
        print(f"Error searching {label}: {e}")
