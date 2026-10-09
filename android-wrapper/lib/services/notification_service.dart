import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:cabsafar/constants.dart';
import 'package:cabsafar/services/api_service.dart';
import 'package:cabsafar/webview_page.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  String? _registeredAccessToken;
  bool _messageHandlersInitialized = false;
  bool _tokenRefreshListenerInitialized = false;

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  Future<bool> init(String accessToken) async {
    if (_registeredAccessToken == accessToken) return true;

    await _firebaseMessaging.requestPermission();

    final fcmToken = await _firebaseMessaging.getToken();
    if (fcmToken == null) return false;
    final registered = await ApiService().sendTokenToServer(
      fcmToken: fcmToken,
      accessToken: accessToken,
    );
    if (!registered) return false;

    _registeredAccessToken = accessToken;
    await _initLocalNotifications();

    if (!_messageHandlersInitialized) {
      _initMessageHandlers();
      _messageHandlersInitialized = true;
    }

    if (!_tokenRefreshListenerInitialized) {
      _listenOnChangeFcmToken();
      _tokenRefreshListenerInitialized = true;
    }
    return true;
  }

  void clearSession() {
    _registeredAccessToken = null;
  }

  Future<void> _initLocalNotifications() async {
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings();

    const InitializationSettings initializationSettings =
        InitializationSettings(android: androidSettings, iOS: iosSettings);

    await _localNotifications.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (response) {
        if (response.payload != null) {
          final data = jsonDecode(response.payload!);
          _handleNotificationTap(data);
        }
      },
    );
  }

  void _initMessageHandlers() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('Foreground push notification received.');
      _showLocalNotification(message);
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint('User opened a push notification.');
      _handleNotificationTap(message.data);
    });

    _firebaseMessaging.getInitialMessage().then((RemoteMessage? message) {
      if (message != null) {
        debugPrint('App opened from a push notification.');
        _handleNotificationTap(message.data);
      }
    });

    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  }

  void _showLocalNotification(RemoteMessage message) {
    final notification = message.notification;
    final android = message.notification?.android;
    if (notification == null) return;

    _localNotifications.show(
      notification.hashCode,
      notification.title,
      notification.body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          'high_importance_channel',
          'High Importance Notifications',
          channelDescription:
              'This channel is used for important notifications.',
          importance: Importance.max,
          priority: Priority.high,
          icon: android?.smallIcon ?? '@mipmap/ic_launcher',
        ),
        iOS: const DarwinNotificationDetails(),
      ),
      payload: jsonEncode(message.data),
    );
  }

  void _handleNotificationTap(Map<String, dynamic> data) {
    final String chatId = data['chat_id'] ?? '';

    if (WebviewPageState.webViewController != null) {
      WebviewPageState.webViewController!.loadUrl(
        urlRequest: URLRequest(url: WebUri('${Constants.chatsUrl}/$chatId')),
      );
    }
  }

  void _listenOnChangeFcmToken() {
    _firebaseMessaging.onTokenRefresh.listen((fcmToken) async {
      final accessToken = _registeredAccessToken;
      if (accessToken == null) return;
      await ApiService().sendTokenToServer(
        fcmToken: fcmToken,
        accessToken: accessToken,
      );
    });
  }
}
