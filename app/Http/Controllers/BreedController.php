<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BreedController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $breeds = Breed::query()
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('breeds/index', [
            'breeds' => $breeds,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('breeds', 'name')],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        Breed::create($data);

        return back()->with('success', 'Breed added.');
    }

    public function update(Request $request, Breed $breed): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('breeds', 'name')->ignore($breed->id)],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $breed->update($data);

        return back()->with('success', 'Breed updated.');
    }

    public function destroy(Breed $breed): RedirectResponse
    {
        $breed->delete();

        return back()->with('success', 'Breed deleted.');
    }
}
