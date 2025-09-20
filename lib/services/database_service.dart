import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/release_model.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._init();
  static Database? _database;
  
  DatabaseService._init();
  
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('rapmaster.db');
    return _database!;
  }
  
  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);
    
    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }
  
  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE releases(
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type INTEGER NOT NULL,
        quality INTEGER NOT NULL,
        releaseDate INTEGER NOT NULL,
        streams INTEGER NOT NULL,
        views INTEGER NOT NULL,
        earnings REAL NOT NULL,
        isViral INTEGER NOT NULL,
        chartPosition INTEGER NOT NULL
      )
    ''');
  }
  
  Future<void> init() async {
    await database;
  }
  
  Future<void> insertRelease(Release release) async {
    final db = await instance.database;
    await db.insert('releases', release.toMap());
  }
  
  Future<List<Release>> getAllReleases() async {
    final db = await instance.database;
    final maps = await db.query('releases', orderBy: 'releaseDate DESC');
    
    return List.generate(maps.length, (i) {
      return Release.fromMap(maps[i]);
    });
  }
  
  Future<void> updateRelease(Release release) async {
    final db = await instance.database;
    await db.update(
      'releases',
      release.toMap(),
      where: 'id = ?',
      whereArgs: [release.id],
    );
  }
  
  Future<void> deleteRelease(String id) async {
    final db = await instance.database;
    await db.delete(
      'releases',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
  
  Future<void> clearDatabase() async {
    final db = await instance.database;
    await db.delete('releases');
  }
  
  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}