from django.db import models
from django.contrib.auth import get_user_model

from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

User = get_user_model()


class Debt(models.Model):
    owner = models.ForeignKey(User, related_name="owner", on_delete=models.CASCADE)
    is_owed = models.ForeignKey(User, related_name="owes", on_delete=models.CASCADE)
    # total amount of the payment
    amount = models.FloatField(validators=[MinValueValidator(0.0)])
    # lent to the other person - how much they owe you
    lent = models.FloatField(validators=[MinValueValidator(0.0)], null=True)
    ratio = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    settled = models.BooleanField(default=False)
    added = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(null=True, blank=True)

    title = models.CharField()
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.title} - {self.owner} to {self.is_owed}"
