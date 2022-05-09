from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class Poznamky(models.Model):
    id = models.AutoField(primary_key=True)
    pouzivatel = models.ForeignKey(User, on_delete=models.CASCADE)
    nazov = models.CharField(max_length=50)
    poznamka = models.TextField(blank=True, null=True)
    vytvorene = models.DateTimeField(auto_now_add=True)
    upravene = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nazov}"

    class Meta:
        verbose_name = "Poznámka"
        verbose_name_plural = "Poznámky"


class Ulohy(models.Model):
    id = models.AutoField(primary_key=True)
    pouzivatel = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=150)
    vytvorene = models.DateTimeField(auto_now_add=True)
    upravene = models.DateTimeField(auto_now=True)
    dokoncene = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Úloha"
        verbose_name_plural = "Úlohy"

    def __str__(self):
        return f"Úloha použivateľa \"{self.pouzivatel.username}\""


class Zoznamy(models.Model):
    id = models.AutoField(primary_key=True)
    pouzivatel = models.ForeignKey(User, on_delete=models.CASCADE)
    nazov = models.CharField(max_length=50)
    polozky = models.JSONField(null=True, blank=True)
    vytvorene = models.DateTimeField(auto_now_add=True)
    upravene = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Zoznam"
        verbose_name_plural = "Zoznamy"

    def __str__(self):
        return f"{self.nazov}"

# vždy keď je vytvorený nový používatel, vygeneruje prihlasovací token pre používateľa
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)