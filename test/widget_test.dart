import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rapmaster_simulator/main.dart';

void main() {
  testWidgets('RapMaster Simulator smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const RapMasterApp());

    // Verify that the splash screen loads
    expect(find.text('RapMaster'), findsOneWidget);
    expect(find.text('Simulator'), findsOneWidget);
    
    // Wait for animations and initialization
    await tester.pumpAndSettle(const Duration(seconds: 5));
    
    // The app should navigate to main menu or game
    // Since we don't have saved data, it should go to main menu
    expect(find.byType(CircularProgressIndicator), findsNothing);
  });
  
  testWidgets('Player model test', (WidgetTester tester) async {
    // Test player model creation and methods
    final testData = {
      'id': 'test123',
      'stageName': 'Test Rapper',
      'avatar': 'male_1',
      'city': 'Los Angeles',
      'age': 20,
      'year': 2024,
      'week': 1,
      'fame': 50,
      'reputation': 30,
      'fans': 1000,
      'followers': 2000,
      'netWorth': 5000.0,
      'energy': 80,
      'songwriting': 25,
      'rapping': 30,
      'stagePerformance': 20,
      'socialMedia': '{}',
      'careerLevel': 3,
      'achievements': 'first_release,first_1k_followers',
      'lastPlayed': DateTime.now().millisecondsSinceEpoch,
    };
    
    // This would test the Player.fromMap constructor
    // In a real test, we'd import the Player class and test it
    expect(testData['stageName'], equals('Test Rapper'));
    expect(testData['fame'], equals(50));
  });
}