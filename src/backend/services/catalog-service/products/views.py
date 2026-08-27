from django.shortcuts import get_object_or_404
from django_filters import rest_framework as filters
from rest_framework import viewsets

from .models import Category, Product
from .permissions import IsStaffOrReadOnly
from .serializers import CategorySerializer, ProductSerializer


class ProductFilter(filters.FilterSet):
    category = filters.CharFilter(field_name="category")
    subCategory = filters.CharFilter(field_name="sub_category")
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")
    in_stock = filters.BooleanFilter(field_name="in_stock")
    is_new = filters.BooleanFilter(field_name="is_new")
    is_on_sale = filters.BooleanFilter(field_name="is_on_sale")
    mine = filters.BooleanFilter(method="filter_mine")

    class Meta:
        model = Product
        fields = ["category", "subCategory", "in_stock", "is_new", "is_on_sale"]

    def filter_mine(self, queryset, name, value):
        if not value:
            return queryset
        user = self.request.user
        user_id = getattr(user, "id", None)
        if not user_id:
            return queryset.none()
        return queryset.filter(created_by=str(user_id))


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = ["name", "description", "fabric", "category"]
    ordering_fields = ["created_at", "price", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = Product.objects.all()
        if self.action in ("list", "retrieve"):
            user = self.request.user
            is_staff = getattr(user, "is_staff_user", False)
            if not is_staff:
                qs = qs.filter(is_active=True)
        return qs

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_url_kwarg or self.lookup_field)
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and str(lookup).isdigit():
            obj = get_object_or_404(queryset, pk=int(lookup))
        else:
            obj = get_object_or_404(queryset, slug=lookup)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=str(getattr(user, "id", "") or ""))


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None
