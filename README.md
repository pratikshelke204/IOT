# Smart IoT Locker System

A secure smart‑locker solution combining RFID card access for users and web‑based password control for admin. All lock/unlock events (with timestamps) and admin password changes are logged to Firebase. A companion web app lets you control the locker, view real‑time status, and pull logs.

## Project Overview

This project implements a multi‑layer authentication locker:
1. **RFID**: Regular users scan their cards to lock/unlock.
2. **Web Password**: Admin sets a password via the website, which is stored in Firebase and used to lock/unlock remotely.

All interactions—RFID scans, password changes, and lock/unlock commands—are pushed to a Firebase Realtime Database with ISO‑8601 timestamps. A web dashboard provides:
- **Control Panel**: Set admin password, lock/unlock remotely  
- **Status View**: See current locked/unlocked state in real time  
- **Logs Viewer**: Query historical events from Firebase

## Features

- **Dual Authentication**: RFID for users, web password for admin  
- **Admin Password Management**: Admin can set/change password from the website interface  
- **Firebase Logging**: Full audit trail with timestamps  
- **Web Dashboard**: Control, status, and logs in one place  
- **Single‑Client Lock**: Only one browser session can control at a time
 

## **Tech Stack**
- **ESP32 (Arduino Framework)**  
- **MFRC522 RFID Module**  
- **Servo/Electronic Lock Mechanism**  
- **Firebase Realtime Database** *(via Firebase ESP Client)*  
- **Web Front-End** – HTML, CSS, JavaScript  
- **Storage** – SPIFFS or LittleFS on ESP32  

## **Repository Structure**
```bash
IOT-main/
├── data/
│   ├── index.html           # Web UI
│   ├── style.css            # Dashboard styling
│   ├── script.js            # Front‑end logic & Firebase sync
│   └── firebaseConfig.js    # Firebase initialization (host, auth)
├── src/
│   ├── locker.ino           # ESP32 sketch
│   └── secrets.h.example    # WiFi & Firebase placeholders
└── README.md
```

## **Hardware Requirements**
- ✅ **ESP32 Development Board**  
- ✅ **MFRC522 RFID Module + Tags**  
- ✅ **Servo Motor or Electronic Lock**  
- ✅ **Breadboard & Jumper Wires**  
- ✅ **12V Power Supply**  

## **Software Requirements**
- **Arduino IDE (≥ v1.8.13)**  
- **ESP32 Arduino Core**  
- **Required Libraries:**  
  - `MFRC522`  
  - `FirebaseESPClient`  
  - `ArduinoJson`  

## **Setup Guide**
### **1. Clone Repository & Install Dependencies**
```bash
git clone https://github.com/pratikshelke204/IOT-main.git
cd IOT-main
```
Open `src/locker.ino` in **Arduino IDE**, then:
- Go to **Sketch → Include Library → Manage Libraries…**
- Install **MFRC522**, **FirebaseESPClient**, **LiquidCrystal I2C** (or any equivalent display library) and **ArduinoJson**  

### **2. Configure Secrets**
Copy `src/secrets.h.example` to `src/secrets.h` and update:
```cpp
#define WIFI_SSID "your-ssid"
#define WIFI_PASSWORD "your-password"
#define FIREBASE_API_KEY "your-firebase-web-api-key"
#define FIREBASE_PROJECT_ID "your-firebase-project-id"
#define FIREBASE_DATABASE_URL "https://youfirebase-projeect-id.firebasedatabase.app/"
#define FIREBASE_USER_EMAIL "user-mail@gmail.com"
#define FIREBASE_USER_PASSWORD "user-password"
```

### **3. Upload Code & Assets**
1. **ESP32 Sketch** – Upload `src/locker.ino` to your ESP32 board.  
2. **Web Assets** – Flash `data/` folder using **SPIFFS/LittleFS uploader**.  
   - Your ESP32 will serve the dashboard at: `http://<esp32-ip>/`.  

## Usage

1. Power on ESP32—note its IP in Serial Monitor.  
2. **User Flow**:  
   - Regular user scans RFID → locker toggles lock state.  
3. **Admin Flow**:  
   - Admin opens browser at `http://<esp32-ip>/`.  
   - Sets or enters the current password to lock/unlock the locker.  
   - Password is saved in Firebase and can be updated anytime.


## Logs & Monitoring

All events are stored under `/locker/logs` in your Firebase Realtime Database, with two child nodes:

```
/locker
└── logs
│ └── web
│  └── <push-id>
│  ├── timestamp: "XXXX-XX-XX T XX:XX:XX" # "YYYY-MM-DD T HH:MM:SS"
│  ├── method: "WEB"
│  ├── action: "unlock" # or "lock"
│  ├── success: "true" # or "false"
│  └── message: "Locker is Unlocked 🔓" # or "Locker is Locked 🔒", "Incorrect Password!"
│ └── rfid
│  └── <push-id>
│  ├── timestamp: "XXXX-XX-XX T XX:XX:XX" # "YYYY-MM-DD T HH:MM:SS"
│  ├── method: "RFID"
│  ├── uid: "XXXXXXXX" # Card UID
│  ├── action: "unlock" # or "deny"
│  ├── success: "true" # or "false"
│  └── message: "Locker is Unlocked 🔓"
└── password

```

markdown
Copy
Edit

- **`web` entries** (admin via website) include:  
  - `timestamp` (ISO‑8601 string)  
  - `method`: `"WEB"`  
  - `action`: `"lock"`, `"unlock"`, or `"SET_PASSWORD"`  
  - `success`: `"true"` or `"false"`  
  - `message`: human‑readable result  

- **`rfid` entries** (user via RFID) include:  
  - `timestamp` (ISO‑8601 string)  
  - `method`: `"RFID"`  
  - `uid`: the scanned card’s UID  
  - `action`: `"unlock"` or `"deny"`  
  - `success`: `"true"` or `"false"`  
  - `message`: human‑readable result  

Use your dashboard’s **Logs** tab to filter, and display these entries by method. 

## **Contributing**
1. **Fork the repository**  
2. **Create a feature branch**  
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes and push**  
   ```bash
   git add .
   git commit -m "Add your message"
   git push origin feature/your-feature
   ```
4. **Submit a Pull Request**  

## **License**
This project is released under the **MIT License**. See `LICENSE` for details.  

## **Contact**
📧 **Soham Wadale**  
- Email: [sr4sohamwadale@gmail.com](mailto:sr4sohamwadale@gmail.com)  
- GitHub: [@SR4Xlucifer](https://github.com/SR4Xlucifer)

📧 **Pratik Shelke**  
- Email: [pratikshelke204@gmail.com](mailto:pratikshelke204@gmail.com)  
- GitHub: [@pratikshelke204](https://github.com/pratikshelke204)

📧 **Chaitanya Pabale**  
- Email: [chaitanyapabale2006@gmail.com](mailto:chaitanyapabale2006@gmail.com)  
- GitHub: [@chaitanyapabale35](https://github.com/chaitanyapabale35)

📧 **Vishal Gore**  
- Email: [vishalngore45@gmail.com](mailto:vishalngore45@gmail.com)  
- GitHub: [@Vishalgoree](https://github.com/Vishalgoree)

---
