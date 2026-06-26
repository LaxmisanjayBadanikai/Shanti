import React, { useState } from 'react';
import { Smartphone, Folder, File, Copy, Check, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CodeFile {
  name: string;
  path: string;
  code: string;
}

const FLUTTER_FILES: CodeFile[] = [
  {
    name: 'main.dart',
    path: 'lib/main.dart',
    code: `import 'package:flutter/flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:peace_os/views/splash_screen.dart';
import 'package:peace_os/views/login_screen.dart';
import 'package:peace_os/theme/material3_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(); // Shanti project initializers
  runApp(const PeaceOSApp());
}

class PeaceOSApp extends StatelessWidget {
  const PeaceOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PeaceOS',
      debugShowCheckedModeBanner: false,
      theme: buildMaterial3Theme(Brightness.light),
      darkTheme: buildMaterial3Theme(Brightness.dark),
      themeMode: ThemeMode.system,
      home: const SplashScreen(),
    );
  }
}`
  },
  {
    name: 'incident.dart',
    path: 'lib/models/incident.dart',
    code: `import 'package:cloud_firestore/cloud_firestore.dart';

enum IncidentStatus { reported, verified, dispatched, resolving, resolved }
enum IncidentSeverity { low, medium, high, critical }

class IncidentModel {
  final String id;
  final String title;
  final String description;
  final String category;
  final IncidentSeverity severity;
  final IncidentStatus status;
  final double latitude;
  final double longitude;
  final String address;
  final String reportedBy;
  final String? aiSummary;
  final int priorityScore;

  IncidentModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.severity,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.reportedBy,
    this.aiSummary,
    required this.priorityScore,
  });

  factory IncidentModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return IncidentModel(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      category: data['category'] ?? '',
      severity: IncidentSeverity.values.byName(data['severity'] ?? 'medium'),
      status: IncidentStatus.values.byName(data['status'] ?? 'reported'),
      latitude: (data['latitude'] as num).toDouble(),
      longitude: (data['longitude'] as num).toDouble(),
      address: data['address'] ?? '',
      reportedBy: data['reportedBy'] ?? '',
      aiSummary: data['aiSummary'],
      priorityScore: data['priorityScore'] ?? 50,
    );
  }
}`
  },
  {
    name: 'ai_service.dart',
    path: 'lib/services/ai_service.dart',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;

class PeaceAIService {
  final String baseUrl;
  
  PeaceAIService({required this.baseUrl});

  Future<Map<String, dynamic>> summarizeIncident(String title, String desc) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/gemini/summarize-incident'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'title': title, 'description': desc}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to fetch Gemini AI triage');
  }

  Future<bool> detectDuplicates(String title, String desc, double lat, double lng) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/gemini/detect-duplicate'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'newIncident': {'title': title, 'description': desc},
        'existingIncidents': [],
      }),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['isDuplicate'] ?? false;
    }
    return false;
  }
}`
  },
  {
    name: 'login_screen.dart',
    path: 'lib/views/login_screen.dart',
    code: `import 'package:flutter/material.dart';
import 'package:peace_os/services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.shield_outlined, size: 80, color: Colors.blue),
            const SizedBox(height: 24),
            Text('Welcome to PeaceOS', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 32),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email Address'),
            ),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            const SizedBox(height: 32),
            _loading 
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: () async {
                    setState(() => _loading = true);
                    // Trigger Firebase Auth login
                    setState(() => _loading = false);
                  },
                  child: const Text('Secure Sign In'),
                ),
          ],
        ),
      ),
    );
  }
}`
  },
  {
    name: 'map_screen.dart',
    path: 'lib/views/map_screen.dart',
    code: `import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController _controller;
  final LatLng _puneCenter = const LatLng(18.5204, 73.8567);
  final Set<Marker> _markers = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live PeaceOS Map')),
      body: GoogleMap(
        initialCameraPosition: CameraPosition(target: _puneCenter, zoom: 13),
        onMapCreated: (controller) => _controller = controller,
        markers: _markers,
        myLocationEnabled: true,
        crowdHeatmapEnabled: true, // Custom PeaceOS SDK extensions
      ),
    );
  }
}`
  }
];

export default function FlutterCodebase() {
  const [activeFile, setActiveFile] = useState<CodeFile>(FLUTTER_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
      
      {/* Sidebar - File Explorer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/45 border-r border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Flutter codebase</h4>
            <p className="text-[10px] text-slate-400">Clean Architecture</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 px-2 py-1">
            <Folder className="w-3.5 h-3.5" /> lib/
          </div>
          
          <div className="space-y-0.5 pl-3">
            {FLUTTER_FILES.map(file => {
              const isActive = activeFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <File className="w-3.5 h-3.5 opacity-80" />
                  {file.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/25 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl space-y-1">
          <span className="text-[9px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest block">Architecture specs</span>
          <p className="text-[10px] text-slate-500 leading-normal font-sans">
            Includes Firebase Auth, Google Maps controllers, and Gemini API integration with standard repository structures.
          </p>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="md:col-span-3 flex flex-col justify-between h-full bg-[#0d1117] text-slate-200">
        <div className="p-4 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">{activeFile.path}</span>
          
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-xs font-bold rounded-lg transition-all flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed max-h-[450px]">
          <pre className="text-emerald-400/90 whitespace-pre">
            {activeFile.code}
          </pre>
        </div>

        <div className="p-3 bg-[#161b22] border-t border-[#21262d] text-[10px] text-slate-400 flex items-center gap-1.5 pl-6 font-sans">
          <Info className="w-4 h-4 text-slate-500" /> Use this code to bootstrap your mobile application directly with Shanti databases.
        </div>

      </div>

    </div>
  );
}
