## Dokumentation der Erstellung von Unit-Tests für das Backend | Name: Christopher Schröpfer | Matrikelnummer: 30267385

### Vorgehensweise

Im Rahmen der Aufgabenstellung wurde die Backend-API um Unit-Tests ergänzt und bestehende Funktionalitäten verbessert. Ziel war es, eine gute Testabdeckung der API zu gewährleisten, indem Eingabedaten validiert und typische Anwendungsfälle und Fehlerfälle abgedeckt werden.

Zunächst wurde die bestehende Codebasis analysiert, um eine Übersicht über die vorhandenen Funktionen und möglichen Fehlerquellen zu erhalten. Dabei wurden die folgenden relevanten Endpunkte identifiziert:

- `GET /todos`
- `GET /todos/:id`
- `PUT /todos/:id`
- `POST /todos`
- `DELETE /todos/:id`

Für diese Endpunkte wurden Tests entworfen, die sowohl positive Szenarien (korrekte Eingabedaten) als auch negative Szenarien (fehlerhafte oder unvollständige Eingaben) abdecken.

Vor Beginn der Arbeiten waren bereits grundlegende Tests vorhanden. Diese Tests deckten die Authentifizierung sowie die grundlegende Funktionalität der Endpunkte ab. Sie prüften positive Szenarien, wie z. B. das Abrufen oder Erstellen von Todos, sowie negative Szenarien, wie beispielsweise die Abfrage eines Todos anhand einer ungültigen ID.

Die Implementierung der Tests erfolgte mit dem Framework supertest, das eine einfache Möglichkeit bietet, HTTP-Anfragen an die API zu simulieren. Dabei wurde supertest in Kombination mit dem Test-Framework jest eingesetzt. Während supertest die eigentlichen HTTP-Anfragen erstellt und die API-Endpunkte testet, übernimmt jest die Rolle des Test-Runners und stellt die Assertions sowie die Ausführung und Organisation der Tests sicher.

Diese Kombination ermöglicht ein effizientes Testen der API, da supertest die API-Aufrufe wie ein echter Client ausführt, während jest sicherstellt, dass die Ergebnisse den Erwartungen entsprechen. Beispielsweise wird überprüft, ob die API den korrekten HTTP-Statuscode zurückgibt oder ob die Antwort die erwarteten Felder enthält.

Zusätzlich wurde die Backend-Validierung erweitert, um Fehler frühzeitig abzufangen und bessere Fehlermeldungen an den Client zu liefern.

---

### Gewählte Lösungen

#### 1. Erweiterung der Validierung
Die Validierung der Eingabedaten wurde um folgende Aspekte ergänzt:

- Prüfung auf korrektes Format der MongoDB-IDs (`isMongoId`).
- Sicherstellung, dass alle erforderlichen Felder (`title`, `due`, `status`) vorhanden und vom korrekten Typ sind.
- Beschränkung der erlaubten Zeichenlänge für das Feld `title` auf 3–100 Zeichen.
- Validierung des Statusfelds, um nur Werte zwischen 0 und 2 zu akzeptieren.
- Prüfung von Datumsfeldern auf Konformität zur ISO 8601.

Diese Validierungsregeln wurden mit Hilfe von `express-validator` definiert und bei den entsprechenden Endpunkten eingebunden. Dadurch wird sichergestellt, dass nur valide Daten in die Datenbank gelangen.

#### 2. Implementierung der Unit-Tests
Für jeden Endpunkt wurden mehrere Testszenarien erstellt:

- **GET /todos**:
  - Erfolgreicher Abruf aller Todos.
  - Fehler bei fehlerhaften Format der ID.

- **POST /todos**:
  - Erfolgreiche Erstellung eines neuen Todos.
  - Fehler bei unvollständigen Eingaben.
  - Fehler bei zusätzlichen nicht erlaubten Feldern.
  - Fehler bei der Angabe von Feldern mit einem falschen Datentyp.

- **GET /todos/:id**:
  - Erfolgreicher Abruf aller Todos.
  - Fehler bei Angabe einer nicht existierenden ID.

- **PUT /todos/:id**:
  - Erfolgreiche Aktualisierung eines Todos.
  - Fehler bei falschen Datentypen.
  - Fehler bei Angabe einer nicht existierenden ID.

- **DELETE /todos/:id**:
  - Erfolgreiche Löschung eines Todos.
  - Fehler bei Angabe einer nicht existierenden ID.

#### 3. Verbesserung der API-Fehlermeldungen
Die API wurde so angepasst, dass im Fehlerfall klar verständliche und spezifische Fehlermeldungen zurückgegeben werden. Beispielsweise werden bei Validierungsfehlern nun alle fehlerhaften Felder mit den jeweiligen Fehlermeldungen zurückgegeben.

---

### Probleme und deren Lösungen

#### Problem: Ungültige Datenformate
**Herausforderung:** Die API konnte Eingaben mit fehlerhaften oder unvollständigen Daten nicht angemessen verarbeiten.  
**Lösung:** Es wurden umfassende Validierungsregeln implementiert, die sicherstellen, dass nur gültige Eingaben akzeptiert werden.

#### Problem: Zusätzliche, nicht erlaubte Felder in Anfragen
**Herausforderung:** Nutzer konnten zusätzliche Felder in den Requests senden, die nicht zur API-Spezifikation gehörten.  
**Lösung:** Eine explizite Prüfung der übermittelten Felder wurde eingeführt. Bei Abweichungen wird ein 400-Fehler (Bad Request) zurückgegeben.

#### Problem: Falsche Fehlermeldungen bei PUT-/POST-Anfragen
**Herausforderung:** Die API gab teilweise unspezifische Fehlermeldungen wie „Bad Request“ aus, was die Fehlerbehebung erschwerte. Außerdem passten die Meldungen und Fehlercodes teilweise nicht zu den bereits vorhandenen Testfällen, sodass einige Testfälle grundsätzlich fehlschlugen.
**Lösung:** Die Fehlermeldungen wurden so überarbeitet, dass sie den genauen Grund des Fehlers benennen, z. B. „Titel muss mindestens 3 Zeichen lang sein“. Außerdem wurden die erwarteten Fehlermeldungen und -Codes in den Testfällen korrigiert.

#### Problem: Authentifizierungsprobleme bei Unit-Tests
**Herausforderung:** Einige Tests erforderten ein gültiges Authentifizierungstoken, obwohl der in der Datei `utils.js` angegebene Keycloak-Server nicht erreichbar war und nach Rücksprache mit Hr. Gawron auch nicht verwendet werden sollte.
**Lösung:** Die Datei `utils.js` wurde entfernt und die Testfälle wurden überarbeitet, sodass keine Authentifizierung mehr erforderlich war.

#### Problem: Bearbeitung und Löschen von Todos im Frontend nicht möglich
**Herausforderung:** Parallel zur Implementierung der Unit-Tests ist aufgefallen, dass das Bearbeiten und Löschen von Todos im Frontend nicht möglich war. Als Ursache stellte sich heraus, dass in den `onclick`-Events der Buttons mit den Klassen `status`, `edit` und `delete` keine Anführungszeichen um die ID des jeweiligen Todos vorhanden waren. Dadurch sind je nach verwendetem Browser verschiedene Fehler aufgetreten und in der Browser-Konsole protokolliert worden.
**Lösung:** Die fehlenden Anführungszeichen wurden ergänzt.

#### Problem: Fehlerhafter Umgang mit IDs im Frontend
**Herausforderung:** Ebenfalls parallel zur Implementierung der Unit-Tests fiel auf, dass das Frontend von numerischen IDs ausgegangen ist. Außerdem wurde das ID-Feld im Frontend `id` genannt, obwohl der korrekte durch die MongoDB erstellte Feldname `_id` lautet. Darüber hinaus wurde die ID nach dem Speichern im Frontend nicht zurückgesetzt, was zu Problemen bei der Speicherung weiterer Todos geführt hat.
**Lösung:** Das Frontend wurde angepasst, sodass das ID-Feld den Namen `_id` hat und die ID nicht mehr in einen Integer konvertiert wird. Zusätzlich wird die ID nun nach dem Speichern via `evt.target._id = ""` zurückgesetzt.

#### Problem: Fehlercode 500 bei PUT mit nicht existierender ID
**Herausforderung:** Bei der Implementierung der Unit-Tests wurde festgestellt, dass bei einem PUT-Aufruf mit einer nicht existierenden ID ein 500-Fehler (Internal Server Error) auftritt. Korrekt wäre in diesem Fall allerdings ein 404-Fehler (Not Found).
**Lösung:** Die Datei `db.js` wurde angepasst, sodass im Fall von `result.matchedCount === 0` null zurückgegeben wird. Dadurch wird sichergestellt, dass in diesem Fall durch die bereits vorhandene Logik ein 404-Fehler an das Frontend zurückgegeben wird.