<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GenderController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $genders = Gender::query()
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('genders/index', [
            'genders' => $genders,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('genders', 'name')],
            'sex' => ['nullable', Rule::in(['male', 'female'])],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        Gender::create($data);

        return back()->with('success', 'Gender added.');
    }

    public function update(Request $request, Gender $gender): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('genders', 'name')->ignore($gender->id)],
            'sex' => ['nullable', Rule::in(['male', 'female'])],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $gender->update($data);

        return back()->with('success', 'Gender updated.');
    }

    public function destroy(Gender $gender): RedirectResponse
    {
        $gender->delete();

        return back()->with('success', 'Gender deleted.');
    }
}
