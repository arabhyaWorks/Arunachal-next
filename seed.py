import requests
import json
from datetime import datetime

# Base API URL
BASE_URL = "http://localhost:3000/api"

def format_tribe_request(tribe_data, detailed_data, media_data):
    """
    Format the request body for a specific tribe with improved media handling
    """
    tribe_name = tribe_data.get("name", "")
    if not tribe_name:
        raise ValueError("Tribe name is required")

    detailed_tribe_data = detailed_data.get(tribe_name, {})

    # Format all media types
    media_items = []
    
    # Handle images from gallery
    for idx, img_url in enumerate(detailed_tribe_data.get("gallery", [])):
        media_items.append({
            "title": f"Tribe Gallery Image {idx + 1}",
            "file_path": img_url,
            "mime_type": "image/jpeg",
            "media_type": "image",
            "description": f"Traditional image of {tribe_name}",
            "created_by": 1,
            "updated_at": datetime.now().isoformat()
        })
    
    # Handle videos
    for video in media_data.get("videos", []):
        if video.get("tribe") == tribe_name:
            media_items.append({
                "title": video.get("title", "Tribal Video"),
                "file_path": f"https://youtube.com/watch?v={video.get('videoId')}",
                "mime_type": "video/youtube",
                "media_type": "video",
                "description": video.get("title", ""),
                "created_by": 1,
                "updated_at": datetime.now().isoformat()
            })
    
    # Handle audio
    for audio in media_data.get("audio", []):
        if audio.get("Tribe Name") == f"{tribe_name} Tribe":
            media_items.append({
                "title": audio.get("Music Name", "Traditional Music"),
                "file_path": audio.get("Music Link"),
                "mime_type": "audio/mpeg",
                "media_type": "audio",
                "description": f"Traditional music of {tribe_name}",
                "thumbnail": audio.get("Thumb Image Link"),
                "created_by": 1,
                "updated_at": datetime.now().isoformat()
            })

    # Create attributes array with all standard attributes
    attributes = [
        {
            "attribute_id": 1,
            "attribute_name": "tribe-About",
            "attribute_type_id": 1,
            "attribute_value": {"value": detailed_tribe_data.get("about", "")}
        },
        {
            "attribute_id": 2,
            "attribute_name": "tribe-History",
            "attribute_type_id": 1,
            "attribute_value": {"value": detailed_tribe_data.get("history", "")}
        },
        {
            "attribute_id": 3,
            "attribute_name": "tribe-Regions",
            "attribute_type_id": 2,
            "attribute_value": {
                "value": detailed_tribe_data.get("distribution", {}).get("mainAreas", [])
            }
        },
        {
            "attribute_id": 4,
            "attribute_name": "tribe-PopulationInNumbers",
            "attribute_type_id": 1,
            "attribute_value": {"value": tribe_data.get("population", "")}
        },
        {
            "attribute_id": 5,
            "attribute_name": "tribe-Settlements",
            "attribute_type_id": 1,
            "attribute_value": {
                "value": detailed_tribe_data.get("distribution", {}).get("settlements", "")
            }
        },
        {
            "attribute_id": 6,
            "attribute_name": "tribe-Language",
            "attribute_type_id": 1,
            "attribute_value": {"value": detailed_tribe_data.get("language", "")}
        },
        {
            "attribute_id": 7,
            "attribute_name": "tribe-TraditionalDresses",
            "attribute_type_id": 2,
            "attribute_value": {
                "value": detailed_tribe_data.get("traditions", {}).get("dress", {}).get("items", [])
            }
        },
        {
            "attribute_id": 8,
            "attribute_name": "tribe-Arts&Crafts",
            "attribute_type_id": 2,
            "attribute_value": {
                "value": detailed_tribe_data.get("traditions", {}).get("crafts", {}).get("items", [])
            }
        },
        {
            "attribute_id": 9,
            "attribute_name": "tribe-TraditionalCuisine",
            "attribute_type_id": 2,
            "attribute_value": {
                "value": detailed_tribe_data.get("traditions", {}).get("cuisine", {}).get("items", [])
            }
        },
        {
            "attribute_id": 10,
            "attribute_name": "tribe-BannerImage",
            "attribute_type_id": 1,
            "attribute_value": {"value": tribe_data.get("image", "")}
        },
        {
            "attribute_id": 11,
            "attribute_name": "tribe-ThumbnailImage",
            "attribute_type_id": 1,
            "attribute_value": {"value": tribe_data.get("image", "")}
        },
        {
            "attribute_id": 12,
            "attribute_name": "tribe-Media",
            "attribute_type_id": 11,
            "attribute_value": media_items
        }
    ]

    return {
        "name": tribe_name,
        "user_id": 1,
        "attributes": attributes
    }

def send_tribe_requests(tribes_data, detailed_data, media_data):
    """
    Send POST requests for all tribes
    """
    headers = {
        "Content-Type": "application/json"
    }

    for tribe in tribes_data:
        try:
            request_body = format_tribe_request(
                tribe,
                detailed_data,
                media_data
            )
            
            response = requests.post(
                f"{BASE_URL}/tribe",
                headers=headers,
                json=request_body
            )
            
            if response.status_code == 200:
                print(f"Successfully created {tribe['name']}")
            else:
                print(f"Failed to create {tribe['name']}. Status: {response.status_code}")
                print(f"Response: {response.text}")
                
        except ValueError as ve:
            print(f"Validation error for tribe: {str(ve)}")
        except Exception as e:
            print(f"Error creating tribe: {str(e)}")

if __name__ == "__main__":
    # Basic tribes data
    tribes_data = [
        {
            "name": "Adi",
            "location": "Siang",
            "population": "150,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg"
        },
        {
            "name": "Apatani",
            "location": "Lower Subansiri",
            "population": "60,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg"
        },
        {
            "name": "Buguns",
            "location": "West Kameng",
            "population": "2,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/Bugun1.jpg"
        },
        {
            "name": "Galo",
            "location": "West Siang",
            "population": "80,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/galo1.jpg"
        },
        {
            "name": "Hrusso And Koro Aka",
            "location": "East Kameng",
            "population": "6,000+",
            "image": "https://indigenous.arunachal.gov.in/song/imagepath?url=/upload/hrusso-and-koro-aka/21/January2025/image/71719AKA_HRUSSO.jpeg&width=550&height=750"
        },
        {
            "name": "Idu",
            "location": "Dibang Valley",
            "population": "12,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/Idu2.jpg"
        },
        {
            "name": "Khamba",
            "location": "Tawang",
            "population": "13,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/Khamba1.jpg"
        },
        {
            "name": "Kaman",
            "location": "Tawang",
            "population": "6,000+",
            "image": "https://indigenous.arunachal.gov.in/upload/tribes/Content/Kaman1.jpg"
        }
    ]

    # Detailed data for each tribe
    detailed_data = {
        "Adi": {
            "name": "Adi Tribe",
            "about": "The Adi, formerly known as Abor, are one of the most populous tribes of Arunachal Pradesh. They are believed to have migrated from southern China in the 16th century. The Adi are known for their rich cultural heritage, vibrant festivals, and unique traditions.",
            "history": "The Adi tribe has a rich historical background dating back several centuries. They are known for their strong administrative system called \"Kebang\" which serves as a traditional court. The tribe has played a significant role in preserving the ecological balance of their region through sustainable practices.",
            "language": "Adi language (Tibeto-Burman family)",
            "distribution": {
                "mainAreas": [
                    "East Siang District",
                    "Upper Siang District",
                    "Lower Dibang Valley"
                ],
                "settlements": "20+ major villages"
            },
            "population": "150,000+",
            "traditions": {
                "dress": {
                    "title": "Traditional Dress",
                    "description": "The Adi traditional dress is known for its intricate weaving patterns and vibrant colors.",
                    "items": ["Galuk", "Bukuk", "Traditional Jewelry", "Ceremonial Attire"]
                },
                "crafts": {
                    "title": "Arts & Crafts",
                    "description": "The tribe is skilled in bamboo and cane crafts.",
                    "items": ["Bamboo Crafts", "Weaving", "Traditional Tools", "Ceremonial Objects"]
                },
                "cuisine": {
                    "title": "Traditional Cuisine",
                    "description": "Adi cuisine is characterized by its use of local ingredients and fermented foods.",
                    "items": ["Apong (Rice Beer)", "Adi Style Pork", "Bamboo Shoot Dishes", "Traditional Preserves"]
                }
            },
            "gallery": [
                "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi2.jpg",
                "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi3.jpg",
                "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi4.jpg",
                "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi5.jpg",
                "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi6.jpg",
                "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi7.jpg"
            ]
        }
        # Add similar detailed data for other tribes...
    }

    # Media data including images, videos, and audio
    media_data = {
        "images": [
            {
                "id": 1,
                "title": "Traditional Festival",
                "description": "Annual harvest festival celebration",
                "associated_tribe_id": 1,
                "file_path": "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
                "media_type": "image",
                "mime_type": "image/jpeg",
                "status": "active",
                "created_by": 1
            }
        ],
        "videos": [
            {
                "id": 1,
                "title": "Traditional Dance Performance",
                "tribe": "Apatani",
                "tribeLogo": "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
                "videoId": "lv_WGEHNtSo",
                "views": "2.3K",
                "duration": "4:15"
            },
            {
                "id": 2,
                "title": "Traditional Music",
                "tribe": "Adi",
                "tribeLogo": "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
                "videoId": "h9a6Qvz5AYI",
                "views": "1.9K",
                "duration": "4:45"
            }
        ],
        "audio": [
                {
                    "Music Name": "Adi Folk Song",
                    "Thumb Image Link": "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
                    "Singer Name": "Traditional",
                    "Tribe Name": "Adi Tribe",
                    "Duration": "03:45",
                    "Music Link": "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81236KONGKU_RAYO_DANCE_OF_ADI.mp3"
                },
                {
                    "Music Name": "Harvest Celebration",
                    "Thumb Image Link": "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi2.jpg",
                    "Singer Name": "Traditional",
                    "Tribe Name": "Adi Tribe",
                    "Duration": "04:20",
                    "Music Link": "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81237TRIBAL_SONG.mp3"
                }
        ]
    }

    const books = [
  {
    title: "The Inheritance of Words",
    author: "Mamang Dai",
    tribes: ["Adi", "Tutsa", "Khamba"],
    image: "The Inheritance of Words"
  },
  {
    title: "Myth, Memory & Folktale",
    author: "Stuart Blackburn",
    tribes: [The Inheritance of Words],
    image: "https://m.media-amazon.com/images/I/81vIMyqAhrL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Tales of Our Ancestors",
    author: "Tai Nyori",
    tribes: ["Kaman", "Tutsa", "Khamba"],
    image: "https://m.media-amazon.com/images/I/81czZPOrKyL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Hill Tribes of Arunachal",
    author: "Ratan Bhattacharjee",
    tribes: ["Adi"],
    image: "https://cdn.exoticindia.com/images/products/original/books-2019-001/aze541.jpg"
  }
];


const musicData = [
  {
    "Music Name": "Myth, Memory & FolktaleMyth, Memory & Folktale",
    "Thumb Image Link":
      "Myth, Memory & FolktaleMyth, Memory & Folktale",
    "Singer Name": "Traditional",
    "Tribe Name": "Adi Tribe",
    Duration: "03:45",
    "Music Link":
      "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81236KONGKU_RAYO_DANCE_OF_ADI.mp3",
  },
  {
    "Music Name": "Harvest Celebration",
    "Thumb Image Link":
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi2.jpg",
    "Singer Name": "Traditional",
    "Tribe Name": "Adi Tribe",
    Duration: "04:20",
    "Music Link":
      "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81237TRIBAL_SONG.mp3",
  },
  {
    "Music Name": "Festival Rhythms",
    "Thumb Image Link":
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi3.jpg",
    "Singer Name": "Traditional",
    "Tribe Name": "Adi Tribe",
    Duration: "05:15",
    "Music Link":
      "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81238ADI_FESTIVAL_SONG.mp3",
  },
];


  const videos = [
    {
      title: "Traditional Dance Performance",
      tribe: "Apatani",
      tribeLogo:
        "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
      videoId: "lv_WGEHNtSo",
      views: "2.3K",
      duration: "4:15",
    },
    {
      title: "Cultural Celebration",
      tribe: "Nyishi",
      tribeLogo:
        "https://indigenous.arunachal.gov.in/upload/tribes/Content/nyishi1.jpg",
      videoId: "PTcoEqRmWp0",
      views: "1.8K",
      duration: "3:45",
    },
    {
      title: "Nocte Ceremony",
      tribe: "Nocte",
      tribeLogo:
        "https://indigenous.arunachal.gov.in/upload/tribes/Content/nocte1.jpg",
      videoId: "YrZkKMkbDk8",
      views: "3.1K",
      duration: "5:20",
    },
    {
      title: "Festival Highlights",
      tribe: "Tagin",
      tribeLogo:
        "https://indigenous.arunachal.gov.in/upload/tribes/Content/tagin1.jpg",
      videoId: "-MMv02n7IMM",
      views: "2.7K",
      duration: "6:10",
    },
    {
      title: "Traditional Music",
      tribe: "Adi",
      tribeLogo:
        "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
      videoId: "h9a6Qvz5AYI",
      views: "1.9K",
      duration: "4:45",
    },
    {
      title: "Heritage Showcase",
      tribe: "Monpa",
      tribeLogo:
        "https://indigenous.arunachal.gov.in/upload/tribes/Content/Monpa1.jpg",
      videoId: "GQIL8w1vwg8",
      views: "2.5K",
      duration: "5:30",
    },
  ];

const books = [
  {
    title: "The Inheritance of Words",
    author: "The Inheritance of Words",
    tribes: ["Adi", "Tutsa", "Khamba"],
    image: "https://zubaanbooks.com/wp-content/uploads/The-Inheritance-of-Words_FRONT-COVER.jpg.webp"
  },
  {
    title: "Myth, Memory & Folktale",
    author: "Stuart Blackburn",
    tribes: ["Apatani", "Puroik", "Khamba"],
    image: "https://m.media-amazon.com/images/I/81vIMyqAhrL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Tales of Our Ancestors",
    author: "Tai Nyori",
    tribes: ["Kaman", "Tutsa", "Khamba"],
    image: "https://m.media-amazon.com/images/I/81czZPOrKyL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Hill Tribes of Arunachal",
    author: "Ratan Bhattacharjee",
    tribes: ["Adi"],
    image: "https://cdn.exoticindia.com/images/products/original/books-2019-001/aze541.jpg"
  }
];


const dishes = [
  {
    name: "PO'ROK Amin",
    image: "https://indigenous.arunachal.gov.in/assets/food/Ami.jpeg",
    category: "Main Course",
    tribe: "Traditional",
    description:
      "A traditional dish from Arunachal Pradesh made using local ingredients and traditional cooking methods.",
  },
  {
    name: "Khow Lam",
    image: "https://indigenous.arunachal.gov.in/assets/food/KhowLa.jpeg",
    category: "Appetizer",
    tribe: "Traditional",
    description:
      "A traditional pancake from the region, showcasing the rich culinary heritage of Arunachal Pradesh.",
  },
  {
    name: "Zan",
    image: "https://indigenous.arunachal.gov.in/assets/food/Za.jpeg",
    category: "Staple",
    tribe: "Traditional",
    description:
      'A hearty and nutritious dish made with millet or maize flour, also known as "Thukpa" in some regions.',
  },
  {
    name: "Mirung Etting",
    image: "https://indigenous.arunachal.gov.in/assets/food/Mirung_Ettin.jpeg",
    category: "Side Dish",
    tribe: "Traditional",
    description:
      "A traditional rice cake often prepared during festivals and special occasions using rice flour and banana leaves.",
  },
];


const festivals = [
    {
      month: 'January',
      events: [
        {
          name: 'Si Donyi Hilo',
          tribe: 'Tagin',
          district: 'Upper Subansiri',
          date: 'Sunday, 5th January - Monday, 6th January',
        },
        {
          name: 'Tongya Festival',
          tribe: 'Monpa',
          district: 'Tawang',
          date: 'Thursday, 9th January',
        },
        {
          name: 'Sarok',
          tribe: 'Aka',
          district: 'Bichom',
          date: 'Saturday, 11th January',
        },
      ],
    },
    {
      month: 'February',
      events: [
        {
          name: 'Reh',
          tribe: 'Idu Mishmi',
          district:
            'Lower Dibang Valley, DibangValley, Lohit, Upper Siang, East Siang',
          date: 'Saturday, 1st February',
        },
        {
          name: 'Donyi Mari',
          tribe: 'Galo',
          district: 'Leparda Lower Siang, West Siang',
          date: 'Wednesday, 5th February',
        },
        {
          name: 'Lhachhuth',
          tribe: 'Meyor',
          district: 'Anjaw',
          date: 'Wednesday, 5th February',
        },
      ],
    },
    {
      month: 'March',
      events: [
        {
          name: 'Losar',
          tribe: 'Monpa, Shendukpen, Memba, Khamba & Meyor',
          district: 'Tawang, West Kameng, Upper Siang & Anjaw',
          date: 'February March - March',
        },
        {
          name: 'Unying Aran Gidi',
          tribe: 'Adi',
          district: 'Siang, Upper Siang, East Siang, Lower Dibang Valley',
          date: 'Friday, 7th March',
        },
      ],
    },
    {
      month: 'April',
      events: [
        {
          name: 'Mopin',
          tribe: 'Galo',
          district: 'Leparda Lower Siang, West Siang',
          date: 'Saturday, 5th April - Tuesday, 8th April',
        },
        {
          name: 'Poogtukuth',
          tribe: 'Tutsa',
          district: 'Changlang & Tirap',
          date: 'Friday, 11th April',
        },
        {
          name: 'Sangken',
          tribe: 'Tai Khamti',
          district: 'Namsai',
          date: 'Monday, 14th April',
        },
      ],
    },
  ];


