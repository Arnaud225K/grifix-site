from django.urls import path
# from .views import CartView, ReceiptView, CartCountView, OrderCallbackView, SendFormOrder, ClearCartView, ThankYouView, GenericErrorView

from .views import  OrderCallbackView, SendFormOrder, SendHouseOrder


app_name = 'checkout'
urlpatterns = [
    # path('', CartView.as_view(), name='cart'),
    # path('receipt/', ReceiptView.as_view(), name='receipt'),
    # path('get_cart_count/', CartCountView.as_view(), name='get_cart_count'),
    path('send_form_order/', SendFormOrder.as_view(), name='send_form_order'),
    path('send_house_order/', SendHouseOrder.as_view(), name='send_house_order'),
    # path('clear_cart/', ClearCartView.as_view(), name='clear_cart'),
    path('order_callback/', OrderCallbackView.as_view(type_order="Заказ обратного звонка (окно)"), name='order_callback'),
    path('order_callback_form/', OrderCallbackView.as_view(type_order="Заказ обратного звонка (форма)"), name='order_callback_form'),
    # path('thank-you/', ThankYouView.as_view(), name='thank-you'),
    # path('generic-error/', GenericErrorView.as_view(), name='generic-error'),
]