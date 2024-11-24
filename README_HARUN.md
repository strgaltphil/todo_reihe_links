

🚀 DOKUMENTATION ZUR TESTIMPLEMENTIERUNG MIT CYPRESS 📋
Name: Harun Silajdzija | Matrikelnummer: 30265109

✨ Einführung und Setup
Zunächst habe ich einen Feature-Branch vom Main-Branch erstellt, nachdem sichergestellt wurde, dass alle Unit-Tests korrekt laufen und keine funktionalen Probleme bestehen.
Anschließend habe ich ein Codespace eingerichtet und im backend-Verzeichnis die notwendigen Abhängigkeiten mit npm install installiert. Die Anwendung konnte anschließend erfolgreich mit "npm run start" gestartet werden.

🧪 Manueller UI-Test und E2E Testabdeckung
Nach einem kurzen manuellen UI-Test, bei dem alle Funktionalitäten überprüft wurden, habe ich eine Liste der Testfälle erstellt, um sicherzustellen, dass die E2E-Testabdeckung gewährleistet ist:

- Seite todo.html laden
- 3 ToDos hinzufügen:
    - Fall 1: Datum vor einem Tag + Status „erledigt”
    - Fall 2: Datum heute + Status „in Bearbeitung”
    - Fall 3: Datum 1 Tag später + Status „offen”
    - Erwartetes Ergebnis: Es werden 3 ToDos gelistet.
- [Bearbeiten Button] ToDo 2 bearbeiten (Name, Datum, Status)
    - Erwartetes Ergebnis: Die neuen Daten werden korrekt im ToDo angezeigt.
- [Status Button] Einmal Status ändern
    - Erwartetes Ergebnis: Der neue Status wird korrekt für das ToDo in der Liste angezeigt.
- [Löschen Button] Löschen aller Testdaten

🔧 Integration von Cypress
Als nächstes habe ich das Cypress npm Package installiert und eine cypress.config.js-Datei erstellt. Diese basierte auf der Konfiguration der vorherigen Übung und wurde später um eine Logik erweitert, die die Base-URL dynamisch ermittelt, da diese nur für localhost konfiguriert war und ich aus dem Codespace heraus arbeitete.

Hierfür habe ich die Variable process.env.CODESPACE_NAME verwendet, um zwischen localhost und Codespace Ausführung zu unterscheiden.

Zusätzlich habe ich folgende Skripte in die package.json aufgenommen, um Cypress-Tests bequem ausführen zu können:
    "scripts": {
        "cy:open": "cypress open",
        "cy:run": "cypress run"
    }
Mit diesen Skripten kann man die Cypress Testlauf-Umgebung entweder im interaktiven Modus (cy:open) oder im Headless-Modus (cy:run) starten.

Beim ersten Testversuch mit Cypress trat eine Fehlermeldung auf, die darauf hinwies, dass eine Standard-Support-Datei fehlte. Diese konnte ich in der Cypress-Dokumentation sowie im letzten Übungsprojekt finden.

Zudem musste ich den Port der Applikation im Codespace öffentlich freigeben, um zu vermeiden, dass Github beim Besuch der App-Seite eine Authentifizierung verlangt. Dies war erforderlich, weil Github vor dem Laden der Seite eine Bestätigung des „Continue“-Buttons anfordert. Diese Bestätigung und das Besuchen der Seite habe ich im support-Verzeichnis in der Datei e2e.js untergebracht, um die Tests sauber zu halten.

✅ Test-Erstellung und -Verifikation
Nach der erfolgreichen Integration von Cypress habe ich die Tests gemäß des oben genannten Testplans erstellt.
Beim Anlegen der ToDos habe ich darauf geachtet, die Attribute objekt-spezifisch zu prüfen, da es mehrere ToDos mit dem gleichen Datum und Status geben könnte.
Da die Tests echte Objekte in der Datenbank erstellen, konnte ich neben den Logmeldungen auch direkt in der Applikation überprüfen, ob die Tests korrekt ausgeführt wurden.

🗑️ Testdaten entfernen
Nachdem alle Tests implementiert und verifiziert waren, habe ich die Testdaten entfernt, um sicherzustellen, dass die Datenbank wieder im ursprünglichen Zustand ist.