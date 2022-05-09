from rest_framework import serializers

from .models import Poznamky, Ulohy, Zoznamy

class PoznamkySerializer(serializers.ModelSerializer):
    class Meta:
        model = Poznamky
        fields = "__all__"

class UlohySerializer(serializers.ModelSerializer):
    class Meta:
        model = Ulohy
        fields = "__all__"

class ZoznamySerializer(serializers.ModelSerializer):
    class Meta:
        model = Zoznamy
        fields = "__all__"