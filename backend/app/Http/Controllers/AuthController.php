<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('tenant', 'roles'),
        ]);
    }

    public function logout(Request $request)
    {
        // Session or mock token invalidation can be added here if needed.
        // For our mock mode, we just return success.
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('tenant', 'roles'));
    }
}
