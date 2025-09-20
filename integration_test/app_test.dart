import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:rapmaster_simulator/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('RapMaster Simulator Integration Tests', () {
    testWidgets('Complete app flow test', (WidgetTester tester) async {
      // Start the app
      app.main();
      await tester.pumpAndSettle();

      // Wait for splash screen to complete
      await tester.pumpAndSettle(const Duration(seconds: 5));

      // Should be at main menu since no save exists
      expect(find.text('Start Career'), findsOneWidget);
      
      // Tap start career
      await tester.tap(find.text('Start Career'));
      await tester.pumpAndSettle();

      // Should be at character creation
      expect(find.text('Create Artist'), findsOneWidget);
      
      // Test avatar selection
      await tester.tap(find.text('Street Style').first);
      await tester.pumpAndSettle();
      
      // Continue to name selection
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();
      
      // Enter stage name
      await tester.enterText(find.byType(TextField), 'Test Rapper');
      await tester.pumpAndSettle();
      
      // Continue to city selection
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();
      
      // Select city (Los Angeles should be default selected)
      await tester.tap(find.text('Start Career'));
      await tester.pumpAndSettle();
      
      // Should now be in the main game
      expect(find.text('Test Rapper'), findsOneWidget);
      expect(find.text('Welcome back,'), findsOneWidget);
      
      // Test navigation
      await tester.tap(find.text('Work'));
      await tester.pumpAndSettle();
      
      expect(find.text('Release System'), findsOneWidget);
      
      // Test going to Studio
      await tester.tap(find.text('Studio'));
      await tester.pumpAndSettle();
      
      expect(find.text('Skills Training'), findsOneWidget);
    });

    testWidgets('Database operations test', (WidgetTester tester) async {
      // Test that database initializes without errors
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 10));
      
      // App should load without database errors
      expect(find.byType(CircularProgressIndicator), findsNothing);
    });
  });
}