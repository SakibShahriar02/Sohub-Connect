-- Sample sound files data
INSERT INTO sound_files (sound_name, file_name, file_url, status, assign_to) VALUES
('Welcome Message', 'welcome.wav', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Active', 'Main IVR'),
('Hold Music', 'hold_music.mp3', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Active', 'Queue System'),
('Goodbye Message', 'goodbye.wav', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Inactive', 'Call End'),
('Business Hours', 'business_hours.wav', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Active', 'Time Routing'),
('Emergency Alert', 'emergency.wav', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Active', 'Emergency System'),
('Menu Options', 'menu_options.wav', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Active', 'Main Menu');