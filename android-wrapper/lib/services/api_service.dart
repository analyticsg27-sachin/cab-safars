import 'dart:convert';

import 'package:cabsafar/constants.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiService {
  Future<bool> sendTokenToServer({
    required String fcmToken,
    required String accessToken,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.apiBaseUrl}/notifications/fcm-token'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
        body: jsonEncode({'token': fcmToken}),
      );

      if (response.statusCode < 200 || response.statusCode >= 300) {
        debugPrint(
          'FCM token registration failed: HTTP ${response.statusCode}',
        );
        return false;
      }
      return true;
    } catch (error) {
      debugPrint('FCM token registration request failed: $error');
      return false;
    }
  }
}
