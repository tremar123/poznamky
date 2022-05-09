from django.contrib import admin
from .models import Poznamky, Ulohy, Zoznamy
from django.forms import widgets
import json
from django.db.models import JSONField
import logging


logger = logging.getLogger(__name__)

# formátovanie JSON stĺpca v admin aplikácií https://stackoverflow.com/a/52627264/16573640
class PrettyJSONWidget(widgets.Textarea):
    def format_value(self, value):
        try:
            value = json.dumps(json.loads(value), indent=2, sort_keys=True)
            row_lengths = [len(r) for r in value.split('\n')]
            self.attrs['rows'] = min(max(len(row_lengths) + 2, 10), 30)
            self.attrs['cols'] = min(max(max(row_lengths) + 2, 40), 120)
            return value
        except Exception as e:
            logger.warning("Error while formatting JSON: {}".format(e))
            return super(PrettyJSONWidget, self).format_value(value)


# stĺpce ktoré budú zobrazené v admin aplikácií
class AdminPoznamky(admin.ModelAdmin):
    list_display = ("id", "nazov", "pouzivatel", "upravene", "vytvorene")
    list_display_links = ("id", "nazov")

class AdminUlohy(admin.ModelAdmin):
    list_display = ("id", "__str__", "dokoncene", "vytvorene")
    list_display_links = ("id", "__str__")

class AdminZoznamy(admin.ModelAdmin):
    list_display = ("id", "nazov", "upravene", "vytvorene")
    list_display_links = ("id", "nazov")
    formfield_overrides = {
        JSONField: {'widget': PrettyJSONWidget}
    }


admin.site.register(Poznamky, AdminPoznamky),
admin.site.register(Ulohy, AdminUlohy),
admin.site.register(Zoznamy, AdminZoznamy),