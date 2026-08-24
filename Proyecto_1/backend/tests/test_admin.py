from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_admin_list_cases():
    response = client.get("/api/admin/cases")
    assert response.status_code == 200
    cases = response.json()
    assert isinstance(cases, list)
    assert len(cases) >= 3

def test_admin_create_and_delete_case():
    test_id = "caso-test-crud"
    new_case = {
        "id": test_id,
        "title": "Caso de Prueba Automatizada",
        "description": "Descripcion de prueba para verificar persistencia en Prolog.",
        "difficulty": "Facil"
    }
    
    # 1. Crear caso
    res_create = client.post("/api/admin/cases", json=new_case)
    assert res_create.status_code == 200
    assert res_create.json()["success"] is True
    
    # 2. Verificar que aparezca en la lista
    res_list = client.get("/api/admin/cases")
    ids = [c["id"] for c in res_list.json()]
    assert test_id in ids
    
    # 3. Eliminar caso
    res_del = client.delete(f"/api/admin/cases/{test_id}")
    assert res_del.status_code == 200
    assert res_del.json()["success"] is True
    
    # 4. Verificar que ya no esté
    res_list_after = client.get("/api/admin/cases")
    ids_after = [c["id"] for c in res_list_after.json()]
    assert test_id not in ids_after
