import 'package:flutter_test/flutter_test.dart';
import 'package:cabsafar/constants.dart';

void main() {
  group('Constants', () {
    test('base URL points to the Cab Safars app', () {
      expect(Constants.baseUrl, 'https://web-lake-nine-24.vercel.app/app/');
    });

    test('chats URL is derived from base URL', () {
      expect(Constants.chatsUrl, '${Constants.baseUrl}chats');
    });

    test('API URL points to the Cab Safars backend', () {
      expect(Constants.apiBaseUrl, 'https://pg.gnikhil.in/cabsafars/api/v1');
    });
  });
}
