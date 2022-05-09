from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.views import ObtainAuthToken
from django.db import IntegrityError

from .models import Poznamky, Ulohy, Zoznamy
from .serializers import PoznamkySerializer, UlohySerializer, ZoznamySerializer

# zoznam linkov
@api_view(["GET"])
def odkazy(request):
    return Response({
        "Prihlásenie(POST)": "/prihlasenie",
        "Registrácia(POST)": "/registracia",
        "Poznamky - zoznam(GET), vytvoriť(POST)": "/poznamky",
        "Ulohy - zoznam(GET), vytvoriť(POST)": "/ulohy",
        "Zoznamy - zoznam(GET), vytvoriť(POST)": "/zoznamy",
        "Poznamka - Upraviť(PUT), Zmazať(DELETE), Zobraziť detaily(GET)": "/poznamka/<int:id>",
        "Uloha - Upraviť(PUT), Zmazať(DELETE), Zobraziť detaily(GET)": "/uloha/<int:id>",
        "Zoznam - Upraviť(PUT), Zmazať(DELETE), Zobraziť detaily(GET)": "/zoznam/<int:id>",
    })

class prihlasenie(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username
        })

# registrácia
@api_view(["POST"])
def register(request):

    # vytvoriť používateľa
    try:
        pouzivatel = User.objects.create_user(
            username=request.data["username"],
            password=request.data["password"]
        )
    except IntegrityError:
        return Response("meno existuje", status=status.HTTP_409_CONFLICT)

    # odoslať token klientovy
    token, created = Token.objects.get_or_create(user=pouzivatel)
    return Response({
        "token": token.key,
        "username": pouzivatel.username
    })


# metóda GET vráti zoznam všetkých používatelových poznámok
# metóda POST vytvorí novú poznámku
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def poznamky(request):
    if request.method == "GET":
        poznamky = Poznamky.objects.filter(pouzivatel=request.user)
        serializer = PoznamkySerializer(poznamky, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data
        data["pouzivatel"] = request.user.id
        serializer = PoznamkySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def ulohy(request):
    if request.method == "GET":
        ulohy = Ulohy.objects.filter(pouzivatel=request.user)
        serializer = UlohySerializer(ulohy, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data
        data["pouzivatel"] = request.user.id
        serializer = UlohySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def zoznamy(request):
    if request.method == "GET":
        zoznamy = Zoznamy.objects.filter(pouzivatel=request.user)
        serializer = ZoznamySerializer(zoznamy, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data
        data["pouzivatel"] = request.user.id
        serializer = ZoznamySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


# detaily, upraviť, zmazať
# metóda GET vráti detaily o poznámke
# metóda PUT aktualizuje poznámku
# metóda DELETE zmaže poznámku
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def poznamka(request, id):
    if request.method == "GET":
        try:
            poznamka = Poznamky.objects.get(pouzivatel=request.user, id=id)
            serializer = PoznamkySerializer(poznamka, many=False)
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


    elif request.method == "PUT":
        try:
            poznamka = Poznamky.objects.get(id=id)
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        data = request.data
        data["pouzivatel"] = request.user.id
        serializer = PoznamkySerializer(instance=poznamka, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


    elif request.method == "DELETE":
        try:
            Poznamky.objects.get(id=id).delete()
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        return Response("Zmazané")


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def uloha(request, id):
    if request.method == "GET":
        try:
            uloha = Ulohy.objects.get(pouzivatel=request.user, id=id)
            serializer = UlohySerializer(uloha, many=False)
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


    elif request.method == "PUT":
        try:
            uloha = Ulohy.objects.get(id=id)
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        data = request.data
        data["pouzivatel"] = request.user.id
        serializer = UlohySerializer(instance=uloha, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


    elif request.method == "DELETE":
        try:
            Ulohy.objects.get(id=id).delete()
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        return Response("Zmazané")


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def zoznam(request, id):
    if request.method == "GET":
        try:
            zoznam = Zoznamy.objects.get(pouzivatel=request.user, id=id)
            serializer = ZoznamySerializer(zoznam)
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


    elif request.method == "PUT":
        try:
            zoznam = Zoznamy.objects.get(pouzivatel=request.user, id=id)
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        data = request.data
        data["pouzivatel"] = request.user.id
        serializer = ZoznamySerializer(instance=zoznam, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


    elif request.method == "DELETE":
        try:
            Zoznamy.objects.get(id=id).delete()
        except ObjectDoesNotExist:
            return Response("Nenájdené", status=status.HTTP_404_NOT_FOUND)
        return Response("Zmazané")
