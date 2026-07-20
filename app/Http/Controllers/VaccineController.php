<?php

namespace App\Http\Controllers;

use App\Models\Vaccine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VaccineController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $vaccines = Vaccine::query()
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('vaccines/index', [
            'vaccines' => $vaccines,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'dose' => ['nullable', 'string', 'max:255'],
        ]);

        Vaccine::create($data);

        return back()->with('success', 'Vaccine added.');
    }

    public function update(Request $request, Vaccine $vaccine): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'dose' => ['nullable', 'string', 'max:255'],
        ]);

        $vaccine->update($data);

        return back()->with('success', 'Vaccine updated.');
    }

    /**
     * A vaccine restricts delete while any vaccination row still points to
     * it -- see the FK rule in the vaccinations migration. Administered doses
     * are medical history and must not be erasable by deleting the catalog
     * entry, so that failure is surfaced as a normal validation-style error
     * rather than a 500.
     */
    public function destroy(Vaccine $vaccine): RedirectResponse
    {
        if ($vaccine->vaccinations()->exists()) {
            return back()->with('error', 'This vaccine has administered doses on record and cannot be deleted.');
        }

        $vaccine->delete();

        return back()->with('success', 'Vaccine deleted.');
    }
}
