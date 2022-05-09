from django.urls import path
from . import views

urlpatterns = [
    path("", views.odkazy),
    path("prihlasenie", views.prihlasenie.as_view()),   # overí prihlasovacie údaje a vráti prihlasovací token https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
    path("registracia", views.register),

    path("poznamky", views.poznamky),
    path("ulohy", views.ulohy),
    path("zoznamy", views.zoznamy),

    path("poznamka/<int:id>", views.poznamka),
    path("uloha/<int:id>", views.uloha),
    path("zoznam/<int:id>", views.zoznam),
]