from django.db import models
from django.urls import reverse

# from menu.models import House


class Order(models.Model):
	name = models.CharField(verbose_name="Ф.И.О", max_length=50)
	email = models.EmailField(verbose_name="E-mail", max_length=50, blank=True, null=True, default='')
	phone = models.CharField(verbose_name="Телефон", max_length=20)
	date = models.DateTimeField(auto_now_add=True)
	ip_address = models.GenericIPAddressField()
	last_updated = models.DateTimeField(auto_now=True)
	type_order = models.CharField(verbose_name="Тип", max_length=128, default='')
	type_client = models.CharField(verbose_name="Клиент", max_length=128, default='')
	text = models.TextField(verbose_name="Текст", blank=True, null=True)
	email_to = models.EmailField(verbose_name="Отправлен", max_length=50, default="", blank=True, null=True)
	
	class Meta:
		ordering = ["-date"]
		verbose_name_plural = "Заявки"
	
	def __str__(self):
		return 'Заказ #' + str(self.id)


# class CartItem(models.Model):
# 	cart_id = models.CharField(max_length=50)
# 	date_added = models.DateTimeField(auto_now_add=True)
# 	quantity = models.IntegerField(default=1)
# 	product = models.ForeignKey(Product, unique=False, blank=True, null=True, on_delete=models.CASCADE)
	
# 	class Meta:
# 		db_table = 'cart_items'
# 		ordering = ['date_added']
	
# 	def total(self):
# 		if self.product and self.product.price is not None:
# 			return self.quantity * self.product.price
# 		return 0  # Return 0 if product or price is None

# 	def name(self):
# 		return self.product.name if self.product else "Unknown Product"

# 	@property
# 	def price(self):
# 		return self.product.price if self.product else 0  # Return 0 if product is None
	
# 	def get_absolute_url(self):
# 		return self.product.get_absolute_url()
	
# 	def augment_quantity(self, quantity):
# 		self.quantity = self.quantity + int(quantity)
# 		self.save()


# class OrderItem(models.Model):
# 	product = models.ForeignKey(Product, on_delete=models.CASCADE)
# 	quantity = models.DecimalField(max_digits=9, decimal_places=2, default=1)
# 	price = models.DecimalField(max_digits=9, decimal_places=2)
# 	order = models.ForeignKey(Order, on_delete=models.CASCADE)
	
# 	@property
# 	def total(self):
# 		return self.quantity * self.price
	
# 	@property
# 	def name(self):
# 		return self.product.name
	
# 	def get_absolute_url(self):
# 		return reverse('menu:product', self.product.slug)
