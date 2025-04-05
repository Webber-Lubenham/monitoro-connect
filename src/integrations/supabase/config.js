"use strict";
/**
 * Configuration for Supabase client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAnonKey = exports.supabaseUrl = exports.STORAGE_KEY = void 0;
// Define a consistent storage key to be used across the app
exports.STORAGE_KEY = 'monitore.auth.token';
// Configuração do Supabase
exports.supabaseUrl = 'https://rsvjnndhbyyxktbczlnk.supabase.co';
exports.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDk3NzksImV4cCI6MjA1ODk4NTc3OX0.AlM_iSptGQ7G5qrJFHU9OECu1wqH6AXQP1zOU70L0T4';
// Validar configuração
if (!exports.supabaseUrl || !exports.supabaseAnonKey) {
    console.error('Supabase configuration missing. Check environment variables.');
}
